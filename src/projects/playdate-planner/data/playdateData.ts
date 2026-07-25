import { CalendarDays, Home, Inbox, ShieldCheck, SmilePlus, UserRoundCheck, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PlaydateTab = "hem" | "kalender" | "vanner" | "forfragningar" | "profil";

export type ChildProfile = {
  name: string;
  age: number;
  school: string;
  interests: string[];
  avatar: string;
  color: string;
};

export type Friend = {
  id: string;
  childName: string;
  parentName: string;
  age: number;
  interests: string[];
  availability: string;
  avatar: string;
  accent: string;
};

export type TimeSlot = {
  id: string;
  day: string;
  date: string;
  time: string;
  state: "ledig" | "bokad" | "vantar";
};

export type RequestItem = {
  id: string;
  title: string;
  message: string;
  status: "ny" | "vantar" | "bekraftad";
};

export type NavItem = {
  id: PlaydateTab;
  label: string;
  icon: LucideIcon;
};

export const childProfile: ChildProfile = {
  name: "Elsa",
  age: 7,
  school: "Björkbacken 1B",
  interests: ["Pyssel", "Minecraft", "Fotboll"],
  avatar: "E",
  color: "#ffb199",
};

export const friends: Friend[] = [
  {
    id: "lucas",
    childName: "Lucas",
    parentName: "Maja",
    age: 8,
    interests: ["Fotboll", "Lego"],
    availability: "Lör 13:00-15:00",
    avatar: "L",
    accent: "#8fd8bd",
  },
  {
    id: "amina",
    childName: "Amina",
    parentName: "Samir",
    age: 7,
    interests: ["Hästar", "Rita"],
    availability: "Ons 16:00-18:00",
    avatar: "A",
    accent: "#f7c873",
  },
  {
    id: "noah",
    childName: "Noah",
    parentName: "Karin",
    age: 6,
    interests: ["Pokémon", "Cykla"],
    availability: "Sön 10:00-12:00",
    avatar: "N",
    accent: "#9eb7ff",
  },
];

export const timeSlots: TimeSlot[] = [
  { id: "wed-16", day: "Onsdag", date: "19 juni", time: "16:00-18:00", state: "ledig" },
  { id: "sat-10", day: "Lördag", date: "22 juni", time: "10:00-12:00", state: "bokad" },
  { id: "sat-13", day: "Lördag", date: "22 juni", time: "13:00-15:00", state: "ledig" },
  { id: "sun-10", day: "Söndag", date: "23 juni", time: "10:00-12:00", state: "vantar" },
];

export const requests: RequestItem[] = [
  {
    id: "r1",
    title: "Ny förfrågan",
    message: "Lucas vill leka med Elsa på lördag 13:00-15:00.",
    status: "ny",
  },
  {
    id: "r2",
    title: "Väntar på svar",
    message: "Du skickade en förfrågan till Amina för onsdag 16:00-18:00.",
    status: "vantar",
  },
];

export const navItems: NavItem[] = [
  { id: "hem", label: "Hem", icon: Home },
  { id: "kalender", label: "Kalender", icon: CalendarDays },
  { id: "vanner", label: "Vänner", icon: UsersRound },
  { id: "forfragningar", label: "Svar", icon: Inbox },
  { id: "profil", label: "Profil", icon: SmilePlus },
];

export const trustHighlights = [
  { icon: ShieldCheck, label: "Godkända kontakter", value: "12" },
  { icon: UserRoundCheck, label: "Familjer aktiva i veckan", value: "8" },
];
