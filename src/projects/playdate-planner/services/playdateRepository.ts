import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export type PlaydateChild = {
  id: string;
  name: string;
  age: number;
  school: string;
  interests: string[];
  avatar: string;
  color: string;
};

export type PlaydateAvailabilitySlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  childIds: string[];
  state: "ledig";
};

export type PlaydateProfile = {
  parentName: string;
  children: PlaydateChild[];
  activeChildId: string;
  availability: PlaydateAvailabilitySlot[];
};

type ProfileRow = {
  parent_name: string;
  active_child_id: string | null;
};

type ChildRow = {
  id: string;
  name: string;
  age: number;
  school: string;
  interests: string[] | null;
  avatar: string;
  color: string;
};

type AvailabilityRow = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  child_ids: string[] | null;
  state: "ledig";
};

function normalizeTime(time: string) {
  return time.slice(0, 5);
}

export async function loadPlaydateProfile(user: User): Promise<PlaydateProfile | null> {
  if (!supabase) {
    return null;
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("playdate_profiles")
    .select("parent_name, active_child_id")
    .eq("user_id", user.id)
    .maybeSingle<ProfileRow>();

  if (profileError) {
    throw profileError;
  }

  if (!profileRow) {
    return null;
  }

  const [{ data: childRows, error: childrenError }, { data: availabilityRows, error: availabilityError }] =
    await Promise.all([
      supabase
        .from("playdate_children")
        .select("id, name, age, school, interests, avatar, color")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .returns<ChildRow[]>(),
      supabase
        .from("playdate_availability_slots")
        .select("id, date, start_time, end_time, child_ids, state")
        .eq("user_id", user.id)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true })
        .returns<AvailabilityRow[]>(),
    ]);

  if (childrenError) {
    throw childrenError;
  }

  if (availabilityError) {
    throw availabilityError;
  }

  const children =
    childRows?.map((child) => ({
      id: child.id,
      name: child.name,
      age: child.age,
      school: child.school,
      interests: child.interests ?? [],
      avatar: child.avatar,
      color: child.color,
    })) ?? [];

  const activeChildId =
    profileRow.active_child_id && children.some((child) => child.id === profileRow.active_child_id)
      ? profileRow.active_child_id
      : children[0]?.id ?? "";

  return {
    parentName: profileRow.parent_name,
    children,
    activeChildId,
    availability:
      availabilityRows?.map((slot) => ({
        id: slot.id,
        date: slot.date,
        startTime: normalizeTime(slot.start_time),
        endTime: normalizeTime(slot.end_time),
        childIds: slot.child_ids ?? [],
        state: slot.state,
      })) ?? [],
  };
}

export async function savePlaydateProfile(user: User, profile: PlaydateProfile) {
  if (!supabase) {
    return;
  }

  const { error: profileError } = await supabase.from("playdate_profiles").upsert({
    user_id: user.id,
    parent_name: profile.parentName,
    active_child_id: profile.activeChildId,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    throw profileError;
  }

  const { error: deleteChildrenError } = await supabase
    .from("playdate_children")
    .delete()
    .eq("user_id", user.id);

  if (deleteChildrenError) {
    throw deleteChildrenError;
  }

  if (profile.children.length) {
    const { error: insertChildrenError } = await supabase.from("playdate_children").insert(
      profile.children.map((child) => ({
        id: child.id,
        user_id: user.id,
        name: child.name,
        age: child.age,
        school: child.school,
        interests: child.interests,
        avatar: child.avatar,
        color: child.color,
      })),
    );

    if (insertChildrenError) {
      throw insertChildrenError;
    }
  }

  const { error: deleteAvailabilityError } = await supabase
    .from("playdate_availability_slots")
    .delete()
    .eq("user_id", user.id);

  if (deleteAvailabilityError) {
    throw deleteAvailabilityError;
  }

  if (profile.availability.length) {
    const { error: insertAvailabilityError } = await supabase.from("playdate_availability_slots").insert(
      profile.availability.map((slot) => ({
        id: slot.id,
        user_id: user.id,
        date: slot.date,
        start_time: slot.startTime,
        end_time: slot.endTime,
        child_ids: slot.childIds,
        state: slot.state,
      })),
    );

    if (insertAvailabilityError) {
      throw insertAvailabilityError;
    }
  }
}
