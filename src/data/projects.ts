export type ProjectCategory = "Webapp" | "Website" | "UX" | "Automation";
export type ProjectMockup = "space-interface" | "mobile-product" | "adventure-game";
export type ProjectStatus = "published" | "upcoming" | "ongoing";

export type Project = {
  id: number;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  image?: string;
  mobileImage?: string;
  imageAlt?: string;
  mockup?: ProjectMockup;
  tags: string[];
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  status?: ProjectStatus;
  caseStudy?: {
    problem: string;
    audience: string;
    solution: string;
    role: string;
    designDecisions: string[];
  };
  gallery: {
    src: string;
    alt: string;
    aspect: "16:10" | "4:5";
  }[];
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Solar Expanse",
    category: "Webapp",
    shortDescription:
      "En interaktiv 3D-upplevelse där användaren scrollar genom solsystemet och får fokuserad planetinformation.",
    image: "/assets/cases/solar-expanse/cover-16x10.webp",
    mobileImage: "/assets/cases/solar-expanse/mobile-4x5.webp",
    imageAlt: "Solar Expanse med solen, planetnavigation och fakta i ett mörkt rymdgränssnitt.",
    tags: ["React", "TypeScript", "Three.js", "Scroll UX"],
    projectUrl: "/projects/solar-expanse",
    featured: true,
    order: 1,
    caseStudy: {
      problem:
        "Traditionell planetinformation blir lätt statisk och texttung. Utmaningen var att göra skalan och resan genom solsystemet begriplig och engagerande.",
      audience:
        "Nyfikna användare som vill upptäcka solsystemet genom en visuell och lättnavigerad webbupplevelse.",
      solution:
        "En scrollstyrd presentation där solen och planeterna delar samma scen, byter fokus mjukt och kompletteras med kort svensk fakta.",
      role:
        "Koncept, UX/UI, frontendutveckling, animation och responsiv anpassning.",
      designDecisions: [
        "En mörk, filmisk palett håller fokus på himlakropparna.",
        "Planetnavigationen ger både överblick och direkt åtkomst.",
        "Storlek, glow och rörelse används för att skapa djup utan tungt gränssnitt.",
      ],
    },
    gallery: [
      {
        src: "/assets/cases/solar-expanse/cover-16x10.webp",
        alt: "Solar Expanse med solen i fokus.",
        aspect: "16:10",
      },
      {
        src: "/assets/cases/solar-expanse/detail-01.webp",
        alt: "Merkurius i Solar Expanse efter scroll från solen.",
        aspect: "16:10",
      },
      {
        src: "/assets/cases/solar-expanse/mobile-4x5.webp",
        alt: "Solar Expanse anpassad för mobil.",
        aspect: "4:5",
      },
    ],
  },
  {
    id: 2,
    title: "Playdate Planner",
    category: "UX",
    shortDescription:
      "En mobil produkt som hjälper föräldrar att hitta gemensamma tider, skicka lekförfrågningar och minska gruppchatt-friktion.",
    image: "/assets/cases/playdate-planner/cover-16x10.webp",
    mobileImage: "/assets/cases/playdate-planner/mobile-4x5.webp",
    imageAlt: "Playdate Planner med svensk introduktion och mobil registreringsvy.",
    tags: ["React", "TypeScript", "Supabase", "Mobile UX"],
    projectUrl: "/projects/playdate-planner",
    featured: true,
    order: 2,
    caseStudy: {
      problem:
        "Föräldrar behöver ofta jämföra tider i flera chattar innan en enkel lekträff kan bokas.",
      audience: "Föräldrar med barn i åldern 4–12 år som planerar aktiviteter tillsammans.",
      solution:
        "En mobilförst produkt med barnprofiler, tillgänglighet, vänkontakter och ett sammanhållet bokningsflöde.",
      role:
        "Produktkoncept, informationsarkitektur, UX/UI, React-frontend och Supabase-integration.",
      designDecisions: [
        "Stora tryckytor och få val per steg minskar den kognitiva belastningen.",
        "Svensk copy och tydliga statusfärger gör prototypen lätt att testa.",
        "Barnens data visas sparsamt och föräldern styr alla kontakter.",
      ],
    },
    gallery: [
      {
        src: "/assets/cases/playdate-planner/cover-16x10.webp",
        alt: "Playdate Planner registreringsflöde på desktop.",
        aspect: "16:10",
      },
      {
        src: "/assets/cases/playdate-planner/detail-01.webp",
        alt: "Den interaktiva Playdate Planner-prototypens startsida.",
        aspect: "16:10",
      },
      {
        src: "/assets/cases/playdate-planner/mobile-4x5.webp",
        alt: "Playdate Planner registreringsflöde på mobil.",
        aspect: "4:5",
      },
    ],
  },
  {
    id: 3,
    title: "The Five Crystals",
    category: "Webapp",
    shortDescription:
      "En spelbar 3D-prototyp för ett fantasyäventyr med utforskning, pussel, strider och kristallvärldar.",
    image: "/assets/cases/the-five-crystals/cover-16x10.webp",
    mobileImage: "/assets/cases/the-five-crystals/mobile-4x5.webp",
    imageAlt: "The Five Crystals startskärm framför den stiliserade 3D-världen.",
    tags: ["React", "Three.js", "TypeScript", "Game UX"],
    projectUrl: "/projects/the-five-crystals",
    featured: true,
    order: 3,
    caseStudy: {
      problem:
        "Ett stort fantasykoncept behövde reduceras till en liten spelbar version med tydlig rörelse, strid och progression.",
      audience: "Barn och ungdomar 8–18 år som uppskattar lättillgängliga äventyrsspel.",
      solution:
        "En semi-isometrisk 3D-prototyp av Root Temple med utforskning, runpussel, fiender, boss och kristallprogression.",
      role:
        "Speldesign, UX/UI, frontendutveckling, 3D-integration och implementation av gameplay-system.",
      designDecisions: [
        "Kameran ger överblick utan att världen tappar djup.",
        "HUD:en visar endast hälsa, uppdrag och handlingar som behövs i stunden.",
        "Stiliserade assets och tydliga effekter gör hot och interaktioner läsbara.",
      ],
    },
    gallery: [
      {
        src: "/assets/cases/the-five-crystals/cover-16x10.webp",
        alt: "The Five Crystals startskärm.",
        aspect: "16:10",
      },
      {
        src: "/assets/cases/the-five-crystals/detail-01.webp",
        alt: "Spelaren i den startade Root Temple-världen.",
        aspect: "16:10",
      },
      {
        src: "/assets/cases/the-five-crystals/mobile-4x5.webp",
        alt: "The Five Crystals introduktion på mobil.",
        aspect: "4:5",
      },
    ],
  },
  {
    id: 4,
    title: "Nordvik Fastigheter",
    category: "Website",
    shortDescription:
      "Ett fiktivt UX/UI-koncept för ett premium fastighetsbolag där arkitektur, hållbarhet och långsiktigt värde står i centrum.",
    image: "/assets/cases/nordvik-fastigheter/cover-16x10.png",
    imageAlt:
      "Nordvik Fastigheter-konceptets startsida med arkitekturbild, mörk navigation och varm premiumkänsla.",
    tags: ["UX-strategi", "UI-design", "IA", "Copy-riktning"],
    projectUrl: "/projects/nordvik-fastigheter",
    featured: true,
    order: 4,
    caseStudy: {
      problem:
        "Fastighetsbolag behöver kommunicera både platsens känsla och konkreta värden utan att upplevelsen blir tung eller för säljande.",
      audience:
        "Intressenter, investerare och potentiella kunder som behöver förstå projekt, hållbarhet och kvalitet snabbt.",
      solution:
        "Ett premiumkoncept med tydlig informationsarkitektur, arkitektoniskt bildspråk, lugn copy-riktning och nära väg till kontakt.",
      role:
        "UX/UI-design, informationsarkitektur, visuell riktning och frontendnära konceptplanering.",
      designDecisions: [
        "Mörk premiumestetik och varm bronsaccent skapar förtroende och materialkänsla.",
        "Projektkort, fakta och hållbarhetsbevis gör erbjudandet mer konkret.",
        "Strukturen leder från inspiration till fördjupning och vidare till intresseanmälan.",
      ],
    },
    gallery: [
      {
        src: "/assets/cases/nordvik-fastigheter/cover-16x10.png",
        alt: "Nordvik Fastigheter hero och första vy.",
        aspect: "16:10",
      },
      {
        src: "/assets/cases/nordvik-fastigheter/nordvik-final-design.png",
        alt: "Nordvik Fastigheter komplett slutdesign.",
        aspect: "16:10",
      },
    ],
  },
  {
    id: 5,
    title: "Eld & Ek",
    category: "Website",
    shortDescription:
      "Ett fiktivt UX/UI-case för en exklusiv nordisk restaurang där öppen eld, hantverk och bokning står i centrum.",
    image: "/assets/cases/eld-ek/cover-16x10.png",
    imageAlt:
      "Eld & Ek-konceptets startsida med mörk premiumestetik, öppen eld, matbild och bokningssektion.",
    tags: ["UX/UI", "Visuell identitet", "Copywriting", "Konvertering"],
    projectUrl: "/projects/eld-ek",
    featured: true,
    order: 5,
    caseStudy: {
      problem:
        "En exklusiv restaurang behöver förmedla atmosfär och hantverk digitalt, inte bara presentera meny och kontaktuppgifter.",
      audience:
        "Gäster som söker en minnesvärd restaurangupplevelse och snabbt vill förstå känsla, nivå och bokningsmöjlighet.",
      solution:
        "Ett mörkt, filmiskt UX/UI-koncept där bildspråk, copy och tydliga CTA:er leder från förväntan till bordsbokning.",
      role:
        "UX/UI-design, visuell identitet, informationsarkitektur, copywriting och konverteringsfokus.",
      designDecisions: [
        "Eld, mörker och gyllene detaljer skapar en varm premiumkänsla.",
        "Bokningsresan hålls nära genom tydliga CTA:er och praktisk information.",
        "Copy och struktur bygger upplevelse innan besökaren möter menyn.",
      ],
    },
    gallery: [
      {
        src: "/assets/cases/eld-ek/cover-16x10.png",
        alt: "Eld & Ek hero och första vy.",
        aspect: "16:10",
      },
      {
        src: "/assets/cases/eld-ek/eld-ek-final-design.png",
        alt: "Eld & Ek komplett slutdesign.",
        aspect: "16:10",
      },
    ],
  },
  {
    id: 6,
    title: "Automation Toolkit",
    category: "Automation",
    shortDescription:
      "Ett experimentellt projekt där jag utforskar hur återkommande IT- och administrativa arbetsuppgifter kan automatiseras med skript och enkla verktyg.",
    mockup: "space-interface",
    tags: ["PowerShell", "Windows", "Automation", "Scripting", "Git", "GitHub"],
    githubUrl: "https://github.com/markusbylund/automation-toolkit",
    featured: true,
    order: 6,
    status: "ongoing",
    caseStudy: {
      problem:
        "Många vardagliga IT- och administrativa moment är repetitiva, manuella och lätta att missa när de görs på rutin.",
      audience:
        "Små team, administratörer och tekniskt nyfikna användare som vill förstå hur enklare scripting kan spara tid.",
      solution:
        "Ett löpande utvecklingsprojekt med små automationslösningar för systeminformation, rapporter, filsortering, diskutrymme och enklare Windows-administration.",
      role:
        "Självständigt lärande, scripting, dokumentation, problemlösning och utforskande av automation i Windows-miljö.",
      designDecisions: [
        "Projektet visar teknisk nyfikenhet och förmåga att identifiera repetitiva arbetsflöden.",
        "Små, avgränsade script gör lärandet konkret och lätt att dokumentera.",
        "Fokus ligger på praktiska problem snarare än stora system eller överbyggda lösningar.",
      ],
    },
    gallery: [],
  },
  {
    id: 7,
    title: "Flöde AI",
    category: "Website",
    shortDescription:
      "Ett kommande SaaS-case med fokus på AI, automation och smartare arbetsflöden för företag.",
    image: "/assets/cases/upcoming/upcoming-ai-platform.png",
    imageAlt: "Kommande case med mörk AI-plattform, dashboard, integrationssektioner och prismoduler.",
    tags: ["AI", "SaaS", "Automation", "Kommer snart"],
    featured: true,
    order: 7,
    status: "upcoming",
    gallery: [],
  },
  {
    id: 8,
    title: "Aura Studio",
    category: "UX",
    shortDescription:
      "Ett kommande premiumcase för skönhet, hudvård och välmående med fokus på lugn, förtroende och enkel bokning.",
    image: "/assets/cases/upcoming/upcoming-aura-studio.png",
    imageAlt: "Kommande case med ljus premiumdesign för skönhet och välmående.",
    tags: ["UX/UI", "Premium", "Bokning", "Kommer snart"],
    featured: true,
    order: 8,
    status: "upcoming",
    gallery: [],
  },
  {
    id: 9,
    title: "Norra Strategi",
    category: "Webapp",
    shortDescription:
      "Ett kommande konsultcase för strategi, digitalisering och affärsutveckling med fokus på tydlig företagskommunikation.",
    image: "/assets/cases/upcoming/upcoming-strategy-site.png",
    imageAlt: "Kommande case med strategikonsulting, ljus företagsdesign och kundcase.",
    tags: ["Strategi", "Konsult", "B2B", "Kommer snart"],
    featured: true,
    order: 9,
    status: "upcoming",
    gallery: [],
  },
  {
    id: 10,
    title: "Sweet Sweden",
    category: "Website",
    shortDescription:
      "Ett kommande e-handelscase för svenskt godis med fokus på färg, produktglädje och en enkel köpresa.",
    image: "/assets/cases/upcoming/upcoming-sweet-sweden.png",
    imageAlt: "Kommande case med färgstark e-handel för svenskt godis.",
    tags: ["E-handel", "Produkt", "Visuell design", "Kommer snart"],
    featured: true,
    order: 10,
    status: "upcoming",
    gallery: [],
  },
];

export function getOrderedProjects(projectList = projects) {
  return [...projectList].sort((projectA, projectB) => projectA.order - projectB.order);
}

export function getFeaturedProjects(projectList = projects) {
  return getOrderedProjects(projectList).filter((project) => project.featured);
}
