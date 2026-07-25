import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  CalendarPlus,
  Check,
  Link as LinkIcon,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRoundPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import {
  childProfile,
  friends,
  navItems,
  requests,
  timeSlots,
  trustHighlights,
  type ChildProfile,
  type PlaydateTab,
} from "./data/playdateData";
import {
  loadPlaydateProfile,
  savePlaydateProfile,
  type PlaydateAvailabilitySlot as AvailabilitySlot,
  type PlaydateChild as ChildEntry,
  type PlaydateProfile as UserProfile,
} from "./services/playdateRepository";
import { isSupabaseConfigured, supabase } from "./services/supabaseClient";
import "./styles/playdate-planner.css";

type StoredProfile =
  | UserProfile
  | {
      parentName: string;
      children: ChildEntry[];
      activeChildId: string;
    }
  | {
      parentName: string;
      child: ChildProfile;
    };

const profileColors = ["#ffb199", "#8fd8bd", "#f7c873", "#9eb7ff"];

function getProfileStorageKey(userId: string) {
  return `playdate-planner-profile:${userId}`;
}

function createChildId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9åäö]+/gi, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "barn"}-${Date.now()}`;
}

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function formatSlotDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function normalizeStoredProfile(storedProfile: StoredProfile): UserProfile {
  if ("children" in storedProfile) {
    return {
      ...storedProfile,
      availability: "availability" in storedProfile ? storedProfile.availability : [],
    };
  }

  const child = {
    ...storedProfile.child,
    id: createChildId(storedProfile.child.name),
  };

  return {
    parentName: storedProfile.parentName,
    children: [child],
    activeChildId: child.id,
    availability: [],
  };
}

function loadStoredProfile(user: User | null) {
  if (!user) {
    return null;
  }

  const storedProfile = localStorage.getItem(getProfileStorageKey(user.id));

  if (!storedProfile) {
    return null;
  }

  try {
    return normalizeStoredProfile(JSON.parse(storedProfile) as StoredProfile);
  } catch {
    return null;
  }
}

function getChildNames(children: ChildEntry[], childIds: string[]) {
  return children
    .filter((child) => childIds.includes(child.id))
    .map((child) => child.name)
    .join(", ");
}

function Avatar({ label, color }: { label: string; color: string }) {
  return (
    <span className="planner-avatar" style={{ "--avatar-color": color } as React.CSSProperties}>
      {label}
    </span>
  );
}

export function PlaydatePlanner() {
  const [activeTab, setActiveTab] = useState<PlaydateTab>("hem");
  const [isPrototypeMode, setIsPrototypeMode] = useState(
    () => new URLSearchParams(window.location.search).get("mode") === "prototype",
  );
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [dataStatus, setDataStatus] = useState("");

  const activeChild = useMemo(() => {
    if (!profile) {
      return null;
    }

    return profile.children.find((child) => child.id === profile.activeChildId) ?? profile.children[0];
  }, [profile]);

  const activeChildAvailability = useMemo(() => {
    if (!profile || !activeChild) {
      return [];
    }

    return profile.availability.filter((slot) => slot.childIds.includes(activeChild.id));
  }, [activeChild, profile]);

  async function signOut() {
    await supabase?.auth.signOut();
  }

  async function hydrateProfile(nextUser: User | null) {
    setUser(nextUser);
    setDataStatus("");

    if (!nextUser) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);

    try {
      const remoteProfile = await loadPlaydateProfile(nextUser);

      if (remoteProfile) {
        setProfile(remoteProfile);
        localStorage.setItem(getProfileStorageKey(nextUser.id), JSON.stringify(remoteProfile));
        return;
      }

      const localProfile = loadStoredProfile(nextUser);
      setProfile(localProfile);

      if (localProfile) {
        await savePlaydateProfile(nextUser, localProfile);
      }
    } catch {
      const localProfile = loadStoredProfile(nextUser);
      setProfile(localProfile);
      setDataStatus("Kunde inte ansluta till databasen. Kontrollera att SQL-tabellerna är skapade i Supabase.");
    } finally {
      setIsProfileLoading(false);
    }
  }

  async function saveProfile(nextProfile: UserProfile) {
    if (!user) {
      return;
    }

    localStorage.setItem(getProfileStorageKey(user.id), JSON.stringify(nextProfile));
    setProfile(nextProfile);
    setIsEditingProfile(false);
    setActiveTab("hem");
    setDataStatus("Sparar...");

    try {
      await savePlaydateProfile(user, nextProfile);
      setDataStatus("");
    } catch {
      setDataStatus("Sparat lokalt, men inte i Supabase ännu. Kör SQL-scriptet och försök igen.");
    }
  }

  function selectChild(childId: string) {
    if (!profile) {
      return;
    }

    void saveProfile({ ...profile, activeChildId: childId });
  }

  function addAvailability(slot: Omit<AvailabilitySlot, "id" | "state">) {
    if (!profile) {
      return;
    }

    const nextSlot: AvailabilitySlot = {
      ...slot,
      id: `slot-${Date.now()}`,
      state: "ledig",
    };

    void saveProfile({
      ...profile,
      availability: [...profile.availability, nextSlot].sort((a, b) =>
        `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
      ),
    });
    setActiveTab("kalender");
  }

  function deleteAvailability(slotId: string) {
    if (!profile) {
      return;
    }

    void saveProfile({
      ...profile,
      availability: profile.availability.filter((slot) => slot.id !== slotId),
    });
    setActiveTab("kalender");
  }

  useEffect(() => {
    if (!supabase) {
      setIsAuthLoading(false);
      return;
    }

    supabase.auth.getUser().then(async ({ data }) => {
      await hydrateProfile(data.user);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setIsEditingProfile(false);
      void hydrateProfile(nextUser);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="planner-route">
      <Link className="planner-back-link" to="/projects">
        <ArrowLeft size={17} />
        Projekt
      </Link>

      <section className="planner-shell" aria-label="Playdate Planner case study">
        <div className="planner-case-copy">
          <p className="planner-kicker">UX/UI Case Study</p>
          <h1>Playdate Planner</h1>
          <p>
            En trygg mobilapp för föräldrar som vill hitta gemensamma tider, skicka lekförfrågningar
            och slippa långa gruppchattar.
          </p>
          <div className="planner-case-points">
            <span>Mobile-first</span>
            <span>Svensk prototyp</span>
            <span>Interaktivt bokningsflöde</span>
          </div>
          <button
            className="planner-prototype-switch"
            onClick={() => setIsPrototypeMode((current) => !current)}
            type="button"
          >
            {isPrototypeMode ? "Öppna riktiga appen" : "Visa interaktiv prototyp"}
          </button>
        </div>

        <div className="phone-frame">
          <div className="phone-screen">
            <button
              className="planner-phone-mode-switch"
              onClick={() => setIsPrototypeMode((current) => !current)}
              type="button"
            >
              {isPrototypeMode ? "Riktiga appen" : "Testa prototyp"}
            </button>
            {isPrototypeMode ? (
              <PrototypeApp />
            ) : !isSupabaseConfigured ? (
              <SupabaseSetupView />
            ) : isAuthLoading || isProfileLoading ? (
              <div className="planner-auth-state">Laddar konto...</div>
            ) : !user ? (
              <AuthView />
            ) : !profile || isEditingProfile ? (
              <ProfileSetupView
                email={user.email ?? ""}
                initialProfile={profile}
                onCancel={
                  profile
                    ? () => {
                        setIsEditingProfile(false);
                        setActiveTab("profil");
                      }
                    : undefined
                }
                onComplete={saveProfile}
              />
            ) : activeChild ? (
              <>
                <header className="planner-header">
                  <div>
                    <p>Hej {profile.parentName}</p>
                    <h2>Planera {activeChild.name}s nästa lek</h2>
                  </div>
                  <button className="planner-icon-button" type="button" aria-label="Aviseringar">
                    <Bell size={18} />
                  </button>
                </header>

                <main className="planner-content">
                  {dataStatus ? <p className="planner-data-status">{dataStatus}</p> : null}
                  <AnimatePresence mode="wait">
                    {activeTab === "hem" ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="planner-view"
                        exit={{ opacity: 0, y: -8 }}
                        initial={false}
                        key="home"
                        transition={{ duration: 0.22 }}
                      >
                        <HomeDashboard
                          availability={activeChildAvailability}
                          childName={activeChild.name}
                          onOpenCalendar={() => setActiveTab("kalender")}
                        />
                      </motion.div>
                    ) : null}

                    {activeTab === "kalender" ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="planner-view"
                        exit={{ opacity: 0, y: -8 }}
                        initial={false}
                        key="calendar"
                      >
                        <CalendarView
                          activeChildId={activeChild.id}
                          availability={profile.availability}
                          children={profile.children}
                          onAddAvailability={addAvailability}
                          onDeleteAvailability={deleteAvailability}
                        />
                      </motion.div>
                    ) : null}

                    {activeTab === "vanner" ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="planner-view"
                        exit={{ opacity: 0, y: -8 }}
                        initial={false}
                        key="friends"
                      >
                        <FriendsView />
                      </motion.div>
                    ) : null}

                    {activeTab === "forfragningar" ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="planner-view"
                        exit={{ opacity: 0, y: -8 }}
                        initial={false}
                        key="requests"
                      >
                        <RequestsView />
                      </motion.div>
                    ) : null}

                    {activeTab === "profil" ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="planner-view"
                        exit={{ opacity: 0, y: -8 }}
                        initial={false}
                        key="profile"
                      >
                        <ProfileView
                          activeChildId={activeChild.id}
                          availabilityCount={profile.availability.length}
                          onEdit={() => setIsEditingProfile(true)}
                          onSelectChild={selectChild}
                          onSignOut={signOut}
                          profile={profile}
                          userEmail={user.email ?? ""}
                        />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </main>

                <nav className="planner-tabbar" aria-label="Appnavigering">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        className={activeTab === item.id ? "is-active" : undefined}
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        type="button"
                      >
                        <Icon size={19} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function PrototypeApp() {
  const [prototypeTab, setPrototypeTab] = useState<PlaydateTab>("hem");
  const [bookingStep, setBookingStep] = useState<"idle" | "friend" | "slot" | "confirmed">("idle");
  const [selectedFriendId, setSelectedFriendId] = useState(friends[0].id);
  const [selectedSlotId, setSelectedSlotId] = useState(
    timeSlots.find((slot) => slot.state === "ledig")?.id ?? timeSlots[0].id,
  );
  const [acceptedRequests, setAcceptedRequests] = useState<string[]>([]);

  const selectedFriend = friends.find((friend) => friend.id === selectedFriendId) ?? friends[0];
  const selectedSlot = timeSlots.find((slot) => slot.id === selectedSlotId) ?? timeSlots[0];

  return (
    <>
      <header className="planner-header">
        <div>
          <p>Hej Markus</p>
          <h2>Planera Elsas nästa lek</h2>
        </div>
        <button className="planner-icon-button" type="button" aria-label="Aviseringar">
          <Bell size={18} />
          <span />
        </button>
      </header>

      <main className="planner-content">
        <AnimatePresence mode="wait">
          {prototypeTab === "hem" ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="planner-view"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key="prototype-home"
            >
              {bookingStep === "idle" ? (
                <>
                  <section className="planner-hero-card">
                    <div>
                      <p>Nästa playdate</p>
                      <h3>Lucas på lördag</h3>
                      <span>13:00–15:00 · Hemma hos Maja</span>
                    </div>
                    <CalendarPlus size={32} />
                  </section>

                  <button className="planner-primary-action" onClick={() => setBookingStep("friend")} type="button">
                    + Skapa playdate
                  </button>

                  <section className="planner-card">
                    <div className="planner-section-title">
                      <div>
                        <p>Smart matchning</p>
                        <h3>3 gemensamma tider</h3>
                      </div>
                      <Sparkles size={19} />
                    </div>
                    <p className="planner-helper">
                      Elsa och hennes vänner har flera överlappande lediga tider den här veckan.
                    </p>
                  </section>
                </>
              ) : null}

              {bookingStep === "friend" ? (
                <section className="planner-card planner-stack">
                  <div className="planner-section-title">
                    <div>
                      <p>Steg 1 av 2</p>
                      <h3>Vem vill Elsa leka med?</h3>
                    </div>
                  </div>
                  {friends.map((friend) => (
                    <button
                      className={
                        selectedFriendId === friend.id ? "planner-friend-card is-selected" : "planner-friend-card"
                      }
                      key={friend.id}
                      onClick={() => setSelectedFriendId(friend.id)}
                      type="button"
                    >
                      <Avatar color={friend.accent} label={friend.avatar} />
                      <span>
                        <strong>{friend.childName}</strong>
                        <small>{friend.interests.join(" · ")}</small>
                      </span>
                    </button>
                  ))}
                  <button className="planner-primary-action" onClick={() => setBookingStep("slot")} type="button">
                    Välj tid
                  </button>
                </section>
              ) : null}

              {bookingStep === "slot" ? (
                <section className="planner-card planner-stack">
                  <div className="planner-section-title">
                    <div>
                      <p>Steg 2 av 2</p>
                      <h3>Välj en gemensam tid</h3>
                    </div>
                  </div>
                  {timeSlots
                    .filter((slot) => slot.state === "ledig")
                    .map((slot) => (
                      <button
                        className={selectedSlotId === slot.id ? "planner-slot is-selected" : "planner-slot"}
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        type="button"
                      >
                        <span>
                          {slot.day} · {slot.date}
                        </span>
                        <strong>{slot.time}</strong>
                        <small>{selectedFriend.childName} är också ledig</small>
                      </button>
                    ))}
                  <button className="planner-primary-action" onClick={() => setBookingStep("confirmed")} type="button">
                    Skicka förfrågan
                  </button>
                </section>
              ) : null}

              {bookingStep === "confirmed" ? (
                <section className="planner-card planner-confirmed">
                  <span>
                    <Check size={24} />
                  </span>
                  <h3>Förfrågan skickad</h3>
                  <p>
                    {selectedFriend.childName} har fått en förfrågan för {selectedSlot.day.toLowerCase()}{" "}
                    {selectedSlot.time}.
                  </p>
                  <button className="planner-secondary-action" onClick={() => setBookingStep("idle")} type="button">
                    Tillbaka till hem
                  </button>
                </section>
              ) : null}
            </motion.div>
          ) : null}

          {prototypeTab === "kalender" ? (
            <motion.div className="planner-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="prototype-calendar">
              <div className="planner-view-heading">
                <p>Elsas vecka</p>
                <h3>Tillgänglighet</h3>
              </div>
              <div className="planner-calendar-grid">
                {timeSlots.map((slot) => (
                  <article className={`planner-time-block is-${slot.state}`} key={slot.id}>
                    <span>
                      {slot.day} · {slot.date}
                    </span>
                    <strong>{slot.time}</strong>
                    <small>{slot.state === "ledig" ? "Ledig" : slot.state === "bokad" ? "Bokad" : "Väntar på svar"}</small>
                  </article>
                ))}
              </div>
            </motion.div>
          ) : null}

          {prototypeTab === "vanner" ? (
            <motion.div className="planner-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="prototype-friends">
              <div className="planner-view-heading">
                <p>Tryggt nätverk</p>
                <h3>Godkända familjer</h3>
              </div>
              <div className="planner-invite-card">
                <button type="button">
                  <QrCode size={18} />
                  QR-kod
                </button>
                <button type="button">
                  <LinkIcon size={18} />
                  Inbjudningslänk
                </button>
              </div>
              <div className="planner-stack">
                {friends.map((friend) => (
                  <article className="planner-friend-card" key={friend.id}>
                    <Avatar color={friend.accent} label={friend.avatar} />
                    <span>
                      <strong>
                        {friend.childName}, {friend.age}
                      </strong>
                      <small>
                        {friend.parentName} · {friend.availability}
                      </small>
                    </span>
                  </article>
                ))}
              </div>
            </motion.div>
          ) : null}

          {prototypeTab === "forfragningar" ? (
            <motion.div className="planner-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="prototype-requests">
              <div className="planner-view-heading">
                <p>Förfrågningar</p>
                <h3>Svara snabbt</h3>
              </div>
              {requests.map((request) => {
                const isAccepted = acceptedRequests.includes(request.id);
                return (
                  <article className="planner-request-card" key={request.id}>
                    <span className={`planner-status is-${isAccepted ? "bekraftad" : request.status}`}>
                      {isAccepted ? "Bekräftad" : request.title}
                    </span>
                    <p>{request.message}</p>
                    {!isAccepted && request.status === "ny" ? (
                      <div>
                        <button
                          onClick={() => setAcceptedRequests((current) => [...current, request.id])}
                          type="button"
                        >
                          Acceptera
                        </button>
                        <button type="button">Ny tid</button>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </motion.div>
          ) : null}

          {prototypeTab === "profil" ? (
            <motion.div className="planner-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="prototype-profile">
              <div className="planner-view-heading">
                <p>Familjeprofil</p>
                <h3>Markus</h3>
              </div>
              <article className="planner-profile-card">
                <Avatar color={childProfile.color} label={childProfile.avatar} />
                <h3>
                  {childProfile.name}, {childProfile.age}
                </h3>
                <p>{childProfile.school}</p>
                <div className="planner-match-list">
                  {childProfile.interests.map((interest) => (
                    <span key={interest}>{interest}</span>
                  ))}
                </div>
              </article>
              <div className="planner-trust-grid">
                {trustHighlights.map(({ icon: Icon, label, value }) => (
                  <article key={label}>
                    <Icon size={20} />
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </article>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <nav className="planner-tabbar" aria-label="Prototypnavigering">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={prototypeTab === item.id ? "is-active" : undefined}
              key={item.id}
              onClick={() => {
                setPrototypeTab(item.id);
                if (item.id !== "hem") setBookingStep("idle");
              }}
              type="button"
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

function SupabaseSetupView() {
  return (
    <div className="planner-auth-screen">
      <div className="planner-auth-card">
        <p className="planner-kicker">Konfiguration saknas</p>
        <h2>Koppla Supabase för att skapa användare</h2>
        <p>
          Lägg till `VITE_SUPABASE_URL` och `VITE_SUPABASE_ANON_KEY` i Netlify eller i en lokal `.env`-fil.
        </p>
      </div>
    </div>
  );
}

function AuthView() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    setStatus(
      mode === "signup"
        ? "Kontot är skapat. Om e-postbekräftelse är aktiv behöver du bekräfta via mail."
        : "Du är inloggad.",
    );
  }

  return (
    <div className="planner-auth-screen">
      <form className="planner-auth-card" onSubmit={handleSubmit}>
        <p className="planner-kicker">Playdate Planner</p>
        <h2>{mode === "signup" ? "Skapa konto" : "Logga in"}</h2>
        <p>Skapa ett föräldrakonto för att testa bokningsflödet med en vän.</p>

        <label>
          E-post
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="du@example.com"
            required
            type="email"
            value={email}
          />
        </label>

        <label>
          Lösenord
          <input
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minst 6 tecken"
            required
            type="password"
            value={password}
          />
        </label>

        <button className="planner-primary-action" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Vänta..." : mode === "signup" ? "Skapa konto" : "Logga in"}
        </button>

        <button
          className="planner-auth-switch"
          onClick={() => {
            setMode((current) => (current === "signup" ? "login" : "signup"));
            setStatus("");
          }}
          type="button"
        >
          {mode === "signup" ? "Har du redan konto? Logga in" : "Ny här? Skapa konto"}
        </button>

        {status ? <p className="planner-auth-status">{status}</p> : null}
      </form>
    </div>
  );
}

function ProfileSetupView({
  email,
  initialProfile,
  onCancel,
  onComplete,
}: {
  email: string;
  initialProfile: UserProfile | null;
  onCancel?: () => void;
  onComplete: (profile: UserProfile) => void;
}) {
  const [parentName, setParentName] = useState(initialProfile?.parentName ?? "");
  const [children, setChildren] = useState<ChildEntry[]>(initialProfile?.children ?? []);
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("7");
  const [school, setSchool] = useState("");
  const [interests, setInterests] = useState("");
  const [color, setColor] = useState(profileColors[children.length % profileColors.length]);

  function resetChildForm() {
    setChildName("");
    setAge("7");
    setSchool("");
    setInterests("");
    setColor(profileColors[(children.length + 1) % profileColors.length]);
  }

  function createChildFromForm() {
    const trimmedChildName = childName.trim();

    if (!trimmedChildName) {
      return null;
    }

    const childInterests = interests
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);

    return {
      id: createChildId(trimmedChildName),
      name: trimmedChildName,
      age: Number(age),
      school: school.trim() || "Skola ej angiven",
      interests: childInterests,
      avatar: trimmedChildName.charAt(0).toUpperCase(),
      color,
    };
  }

  function addChild() {
    const nextChild = createChildFromForm();

    if (!nextChild) {
      return;
    }

    setChildren((currentChildren) => [...currentChildren, nextChild]);
    resetChildForm();
  }

  function removeChild(childId: string) {
    setChildren((currentChildren) => currentChildren.filter((child) => child.id !== childId));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pendingChild = createChildFromForm();
    const nextChildren = pendingChild ? [...children, pendingChild] : children;

    if (!nextChildren.length) {
      return;
    }

    const activeChildId =
      initialProfile?.activeChildId && nextChildren.some((child) => child.id === initialProfile.activeChildId)
        ? initialProfile.activeChildId
        : nextChildren[0].id;
    const validChildIds = new Set(nextChildren.map((child) => child.id));

    onComplete({
      parentName: parentName.trim(),
      children: nextChildren,
      activeChildId,
      availability:
        initialProfile?.availability
          .map((slot) => ({
            ...slot,
            childIds: slot.childIds.filter((childId) => validChildIds.has(childId)),
          }))
          .filter((slot) => slot.childIds.length > 0) ?? [],
    });
  }

  return (
    <div className="planner-onboarding-screen">
      <form className="planner-onboarding-card" onSubmit={handleSubmit}>
        {onCancel ? (
          <button className="planner-editor-back" onClick={onCancel} type="button">
            <ArrowLeft size={17} />
            Tillbaka till appen
          </button>
        ) : null}

        <div>
          <p className="planner-kicker">{initialProfile ? "Redigera profil" : "Välkommen"}</p>
          <h2>{initialProfile ? "Familjeprofil" : "Sätt upp din familjeprofil"}</h2>
          <p>Lägg till de barn som ska kunna planera playdates från samma föräldrakonto.</p>
        </div>

        <label>
          Ditt namn
          <input
            autoComplete="name"
            onChange={(event) => setParentName(event.target.value)}
            placeholder="Markus"
            required
            value={parentName}
          />
        </label>

        {children.length ? (
          <div className="planner-child-list">
            {children.map((child) => (
              <article key={child.id}>
                <Avatar color={child.color} label={child.avatar} />
                <span>
                  <strong>
                    {child.name}, {child.age}
                  </strong>
                  <small>{child.school}</small>
                </span>
                <button
                  aria-label={`Ta bort ${child.name}`}
                  disabled={children.length === 1 && !childName.trim()}
                  onClick={() => removeChild(child.id)}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
          </div>
        ) : null}

        <div className="planner-child-form">
          <p>{children.length ? "Lägg till ett barn till" : "Barnets uppgifter"}</p>
          <label>
            Barnets namn
            <input
              autoComplete="off"
              onChange={(event) => setChildName(event.target.value)}
              placeholder="Elsa"
              value={childName}
            />
          </label>

          <div className="planner-form-grid">
            <label>
              Ålder
              <input
                inputMode="numeric"
                max="12"
                min="4"
                onChange={(event) => setAge(event.target.value)}
                type="number"
                value={age}
              />
            </label>

            <label>
              Skola/klass
              <input
                autoComplete="off"
                onChange={(event) => setSchool(event.target.value)}
                placeholder="Frivilligt"
                value={school}
              />
            </label>
          </div>

          <label>
            Intressen
            <input
              autoComplete="off"
              onChange={(event) => setInterests(event.target.value)}
              placeholder="Fotboll, Minecraft, pyssel"
              value={interests}
            />
          </label>

          <fieldset className="planner-color-field">
            <legend>Profilfärg</legend>
            <div>
              {profileColors.map((profileColor) => (
                <button
                  aria-label={`Välj profilfärg ${profileColor}`}
                  className={color === profileColor ? "is-selected" : undefined}
                  key={profileColor}
                  onClick={() => setColor(profileColor)}
                  style={{ "--avatar-color": profileColor } as React.CSSProperties}
                  type="button"
                >
                  <Check size={15} />
                </button>
              ))}
            </div>
          </fieldset>

          <button className="planner-secondary-action" disabled={!childName.trim()} onClick={addChild} type="button">
            + Lägg till barn
          </button>
        </div>

        <p className="planner-auth-status">Inloggad som {email}</p>
        <div className="planner-action-row">
          {onCancel ? (
            <button className="planner-secondary-action" onClick={onCancel} type="button">
              Avbryt
            </button>
          ) : null}
          <button className="planner-primary-action" disabled={!children.length && !childName.trim()} type="submit">
            Spara och fortsätt
          </button>
        </div>
      </form>
    </div>
  );
}

function HomeDashboard({
  availability,
  childName,
  onOpenCalendar,
}: {
  availability: AvailabilitySlot[];
  childName: string;
  onOpenCalendar: () => void;
}) {
  const nextSlot = availability[0];

  return (
    <>
      <section className="planner-hero-card planner-empty-hero">
        <div>
          <p>{nextSlot ? "Nästa lediga tid" : "Kom igång"}</p>
          <h3>
            {nextSlot
              ? `${formatSlotDate(nextSlot.date)} ${nextSlot.startTime}-${nextSlot.endTime}`
              : `Skapa ${childName}s första lediga tid`}
          </h3>
          <span>
            {nextSlot
              ? `${childName} är markerad som ledig.`
              : "När du markerar tider kan godkända föräldrar se när ni kan ses."}
          </span>
        </div>
        <CalendarPlus size={32} />
      </section>

      <section className="planner-card planner-booking">
        <div className="planner-section-title">
          <div>
            <p>Nästa steg</p>
            <h3>{availability.length ? `${availability.length} lediga tider` : "Din app är redo"}</h3>
          </div>
          <Sparkles size={19} />
        </div>
        <div className="planner-empty-state">
          <span>
            <UserRoundPlus size={22} />
          </span>
          <h3>{availability.length ? "Bjud in en familj" : "Inga vänner eller bokningar ännu"}</h3>
          <p>
            {availability.length
              ? "Nästa steg är att lägga till godkända föräldrar så de kan se matchande tider."
              : "Börja med att lägga till tillgänglighet och bjud sedan in en förälder du känner."}
          </p>
          <button className="planner-secondary-action" onClick={onOpenCalendar} type="button">
            {availability.length ? "Hantera tider" : "+ Lägg till tid"}
          </button>
        </div>
      </section>

      <section className="planner-card">
        <div className="planner-section-title">
          <div>
            <p>Smart matchning</p>
            <h3>Aktiveras när nätverket växer</h3>
          </div>
          <span className="planner-badge">Kommer</span>
        </div>
        <p className="planner-helper">
          När fler familjer är anslutna kan appen föreslå gemensamma lediga tider automatiskt.
        </p>
      </section>
    </>
  );
}

function CalendarView({
  activeChildId,
  availability,
  children,
  onAddAvailability,
  onDeleteAvailability,
}: {
  activeChildId: string;
  availability: AvailabilitySlot[];
  children: ChildEntry[];
  onAddAvailability: (slot: Omit<AvailabilitySlot, "id" | "state">) => void;
  onDeleteAvailability: (slotId: string) => void;
}) {
  const [date, setDate] = useState(getTodayInputValue());
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("18:00");
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([activeChildId]);

  function toggleChild(childId: string) {
    setSelectedChildIds((currentIds) =>
      currentIds.includes(childId)
        ? currentIds.filter((currentId) => currentId !== childId)
        : [...currentIds, childId],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedChildIds.length || startTime >= endTime) {
      return;
    }

    onAddAvailability({
      date,
      startTime,
      endTime,
      childIds: selectedChildIds,
    });
  }

  return (
    <>
      <div className="planner-view-heading">
        <p>Veckokalender</p>
        <h3>Lägg till lediga tider</h3>
      </div>

      <form className="planner-card planner-availability-form" onSubmit={handleSubmit}>
        <label>
          Datum
          <input onChange={(event) => setDate(event.target.value)} required type="date" value={date} />
        </label>

        <div className="planner-form-grid">
          <label>
            Från
            <input onChange={(event) => setStartTime(event.target.value)} required type="time" value={startTime} />
          </label>
          <label>
            Till
            <input onChange={(event) => setEndTime(event.target.value)} required type="time" value={endTime} />
          </label>
        </div>

        <fieldset className="planner-child-picker">
          <legend>Gäller för</legend>
          {children.map((child) => (
            <button
              className={selectedChildIds.includes(child.id) ? "is-selected" : undefined}
              key={child.id}
              onClick={() => toggleChild(child.id)}
              type="button"
            >
              <Avatar color={child.color} label={child.avatar} />
              <span>{child.name}</span>
              <Check size={16} />
            </button>
          ))}
        </fieldset>

        {startTime >= endTime ? <p className="planner-auth-status">Sluttiden behöver vara efter starttiden.</p> : null}

        <button className="planner-primary-action" disabled={!selectedChildIds.length || startTime >= endTime} type="submit">
          Spara ledig tid
        </button>
      </form>

      {availability.length ? (
        <div className="planner-availability-list">
          {availability.map((slot) => (
            <article className="planner-time-block is-ledig" key={slot.id}>
              <div>
                <span>{formatSlotDate(slot.date)}</span>
                <strong>
                  {slot.startTime}-{slot.endTime}
                </strong>
                <small>{getChildNames(children, slot.childIds)}</small>
              </div>
              <button aria-label="Ta bort tid" onClick={() => onDeleteAvailability(slot.id)} type="button">
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="planner-calendar-empty">
          <CalendarPlus size={28} />
          <h3>Ingen tillgänglighet ännu</h3>
          <p>Välj datum, tid och vilka barn som är lediga. Då blir bokningar enklare längre fram.</p>
        </div>
      )}
    </>
  );
}

function FriendsView() {
  return (
    <>
      <div className="planner-view-heading">
        <p>Tryggt nätverk</p>
        <h3>Godkända familjer</h3>
      </div>
      <div className="planner-invite-card">
        <button type="button">
          <QrCode size={18} />
          QR-kod
        </button>
        <button type="button">
          <LinkIcon size={18} />
          Inbjudningslänk
        </button>
      </div>
      <div className="planner-card planner-empty-state">
        <span>
          <ShieldCheck size={22} />
        </span>
        <h3>Inga vänner tillagda ännu</h3>
        <p>Lägg till föräldrar via QR-kod eller inbjudningslänk. Bara godkända kontakter kan se era tider.</p>
      </div>
    </>
  );
}

function RequestsView() {
  return (
    <>
      <div className="planner-view-heading">
        <p>Förfrågningar</p>
        <h3>Svara snabbt</h3>
      </div>
      <div className="planner-card planner-empty-state">
        <span>
          <Check size={22} />
        </span>
        <h3>Inga förfrågningar ännu</h3>
        <p>När någon skickar en lekförfrågan visas den här med svarsalternativen acceptera, avböj eller föreslå ny tid.</p>
      </div>
    </>
  );
}

function ProfileView({
  activeChildId,
  availabilityCount,
  onEdit,
  onSelectChild,
  onSignOut,
  profile,
  userEmail,
}: {
  activeChildId: string;
  availabilityCount: number;
  onEdit: () => void;
  onSelectChild: (childId: string) => void;
  onSignOut: () => void;
  profile: UserProfile;
  userEmail: string;
}) {
  return (
    <>
      <div className="planner-view-heading">
        <p>Familjeprofil</p>
        <h3>{profile.parentName}</h3>
      </div>

      <div className="planner-profile-list">
        {profile.children.map((child) => (
          <button
            className={child.id === activeChildId ? "planner-profile-card is-selected" : "planner-profile-card"}
            key={child.id}
            onClick={() => onSelectChild(child.id)}
            type="button"
          >
            <Avatar color={child.color} label={child.avatar} />
            <h3>
              {child.name}, {child.age}
            </h3>
            <p>{child.school}</p>
            {child.interests.length ? (
              <div className="planner-match-list">
                {child.interests.map((interest) => (
                  <span key={interest}>{interest}</span>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>

      <div className="planner-trust-grid">
        <article>
          <ShieldCheck size={20} />
          <strong>0</strong>
          <span>Godkända kontakter</span>
        </article>
        <article>
          <CalendarPlus size={20} />
          <strong>{availabilityCount}</strong>
          <span>Lediga tider</span>
        </article>
      </div>
      <p className="planner-privacy-note">
        Inloggad som {userEmail}. Barninformation är privat som standard. Endast godkända föräldrar ska kunna se
        tillgänglighet när nätverket kopplas på.
      </p>
      <button className="planner-secondary-action" onClick={onEdit} type="button">
        Redigera profil
      </button>
      <button className="planner-secondary-action" onClick={onSignOut} type="button">
        Logga ut
      </button>
    </>
  );
}
