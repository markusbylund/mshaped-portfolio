type SeoEntry = {
  title: string;
  description: string;
  image: string;
};

export const seoByPath: Record<string, SeoEntry> = {
  "/": {
    title: "Mshaped | Frontendutveckling, UX och digital utveckling",
    description:
      "Mshaped hjälper företag att skapa tydliga webbplatser och digitala produkter med UX, React och modern frontendutveckling.",
    image: "/assets/social/mshaped-og.webp",
  },
  "/projects": {
    title: "Case | Mshaped",
    description:
      "Utforska case inom strategi, UX/UI, frontend, webbdesign, webbappar, automation och spelprototyper från Mshaped.",
    image: "/assets/social/mshaped-og.webp",
  },
  "/about": {
    title: "Om Mshaped",
    description:
      "Läs om Markus arbetssätt och kombinationen av frontendutveckling, UX, problemlösning, automation och teknisk nyfikenhet.",
    image: "/assets/social/mshaped-og.webp",
  },
  "/services": {
    title: "Tjänster | Mshaped",
    description:
      "Frontendutveckling, webbplatser, webbappar och fokuserade UX-förbättringar för digitala produkter.",
    image: "/assets/social/mshaped-og.webp",
  },
  "/contact": {
    title: "Kontakt | Mshaped",
    description:
      "Berätta om ert projekt, er digitala produkt eller den användarupplevelse ni vill förbättra.",
    image: "/assets/social/mshaped-og.webp",
  },
  "/projects/solar-expanse": {
    title: "Solar Expanse | Mshaped",
    description:
      "Ett interaktivt, scrollstyrt solsystem med svensk planetfakta och filmisk visuell design.",
    image: "/assets/cases/solar-expanse/cover-16x10.webp",
  },
  "/projects/playdate-planner": {
    title: "Playdate Planner | Mshaped",
    description:
      "En mobilförst produkt som hjälper föräldrar att samordna tillgänglighet och boka lekträffar.",
    image: "/assets/cases/playdate-planner/cover-16x10.webp",
  },
  "/projects/the-five-crystals": {
    title: "The Five Crystals | Mshaped",
    description:
      "En spelbar 3D-prototyp med fantasyvärld, pussel, strid och kristallprogression.",
    image: "/assets/cases/the-five-crystals/cover-16x10.webp",
  },
  "/projects/nordvik-fastigheter": {
    title: "Nordvik Fastigheter | Mshaped",
    description:
      "Ett fiktivt UX/UI-case för ett premium fastighetsbolag med fokus på förtroende, arkitektur och tydlig projektkommunikation.",
    image: "/assets/cases/nordvik-fastigheter/cover-16x10.png",
  },
  "/projects/eld-ek": {
    title: "Eld & Ek | Mshaped",
    description:
      "Ett fiktivt UX/UI-case för en exklusiv nordisk restaurangupplevelse med fokus på atmosfär, hantverk och bokningsresa.",
    image: "/assets/cases/eld-ek/cover-16x10.png",
  },
};

export const fallbackSeo: SeoEntry = {
  title: "Mshaped",
  description: "Frontendutveckling, UX och digital utveckling.",
  image: "/assets/social/mshaped-og.webp",
};
