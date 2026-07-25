import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./nordvik-fastigheter.css";

const finalDesignImage = "/assets/cases/nordvik-fastigheter/nordvik-final-design.png";
const heroDesignImage = "/assets/cases/nordvik-fastigheter/cover-16x10.png";

const heroTags = [
  "UX-strategi",
  "UI-design",
  "Informationsarkitektur",
  "Copy-riktning",
  "Responsiv design",
];

const overviewItems = [
  { label: "Bransch", value: "Fastighet & stadsutveckling" },
  { label: "Uppdrag", value: "Digital konceptupplevelse" },
  { label: "Fokus", value: "Förtroende, projektförståelse och konvertering" },
  { label: "Min roll", value: "UX/UI-design, informationsarkitektur och visuell riktning" },
];

const startingPoints = [
  "Skapa en önskvärd bild av framtida boende och stadsliv",
  "Göra erbjudandet och projekten enklare att förstå",
  "Leda besökaren mot rätt nästa steg utan att upplevas säljande",
];

const communicationSteps = [
  { title: "Upplevelsen", text: "Visa platser där människor vill leva, arbeta och mötas." },
  { title: "Löftet", text: "Skapa platser som människor är stolta över - idag och över tid." },
  { title: "Bevisen", text: "Projekt, hållbarhetsarbete, kvalitet och erfarenhet." },
  { title: "Nästa steg", text: "Utforska projekt, anmäl intresse eller ta kontakt." },
];

const designPrinciples = [
  {
    title: "Tydlighet före komplexitet",
    text: "Fastighetsinformation kan snabbt bli tung. Därför prioriteras tydliga val, korta textnivåer och logisk vägledning.",
  },
  {
    title: "Förtroende före säljtryck",
    text: "Konceptet bygger värde genom ton, bevis och lugn struktur snarare än hårda säljbudskap.",
  },
  {
    title: "Arkitektur som berättelse",
    text: "Bildspråk och komposition lyfter platsens känsla och hjälper besökaren föreställa sig framtida liv där.",
  },
  {
    title: "Hållbarhet som konkret bevis",
    text: "Hållbarhet behandlas som en del av kvaliteten, med tydliga fakta, certifieringar och projektkopplingar.",
  },
];

const palette = [
  { name: "Mattsvart", value: "#071012" },
  { name: "Varm stengrå", value: "#9b9186" },
  { name: "Brons", value: "#b98955" },
  { name: "Off-white", value: "#f3eee6" },
];

const finalNotes = [
  { title: "Hero", text: "Börjar i målbilden och känslan av platsen." },
  {
    title: "Projekt",
    text: "Gör erbjudandet konkret med visuellt starka projektkort och tydlig metadata.",
  },
  {
    title: "Bevis & kontakt",
    text: "Bygger trygghet genom hållbarhet, erfarenhet och tydliga kontaktvägar.",
  },
];

const responsiveCards = [
  "Prioriterad navigation",
  "Tydliga CTA:er",
  "Läsbar och komprimerad projektinformation",
];

const implementationCards = [
  "Semantisk struktur",
  "Tillgänglighet",
  "Prestanda",
  "Återanvändbara komponenter",
];

function CaseSection({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <section className="nordvik-case-section" data-reveal>
      <div className="nordvik-case-heading">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="nordvik-mini-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function NordvikFastigheter() {
  return (
    <article className="nordvik-case-page">
      <header className="nordvik-hero">
        <div className="container nordvik-hero-grid">
          <div className="nordvik-hero-copy">
            <p className="eyebrow">Fiktivt UX/UI-koncept</p>
            <h1>Nordvik Fastigheter</h1>
            <p className="nordvik-lead">
              En digital upplevelse för ett fastighetsbolag där arkitektur, hållbarhet och
              långsiktigt värde står i centrum.
            </p>
            <p>
              Nordvik Fastigheter är ett självinitierat koncept för ett premium fastighetsbolag.
              Målet var att skapa en tydlig digital upplevelse som bygger förtroende, gör projekt
              enkla att utforska och leder vidare till kontakt eller intresseanmälan.
            </p>

            <ul className="nordvik-tag-list" aria-label="Kompetenser i caset">
              {heroTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            <p className="nordvik-case-note">
              Fiktivt portfolio-case. Projekt, målgrupper, data och resultat är designantaganden.
            </p>
          </div>

          <figure className="nordvik-hero-visual">
            <img
              alt="Nordvik Fastigheter slutdesign med mörk hero, arkitekturbild, projektkort, hållbarhetsbevis och kontaktsektion."
              src={heroDesignImage}
              loading="eager"
            />
          </figure>
        </div>
      </header>

      <main className="container nordvik-case-content">
        <section className="nordvik-overview" aria-label="Case-översikt" data-reveal>
          {overviewItems.map((item) => (
            <MiniCard key={item.label} {...item} />
          ))}
        </section>

        <CaseSection title="Fastigheter handlar om mer än byggnader." eyebrow="Utgångspunkt">
          <div className="nordvik-split">
            <p>
              För att skapa intresse behöver ett fastighetsbolag kommunicera både känslan av
              platsen och de konkreta värdena bakom den. Nordvik behövde därför kombinera
              inspirerande arkitektur, tydlig projektinformation och trovärdiga bevis på kvalitet
              och hållbarhet.
            </p>
            <ul className="nordvik-check-list">
              {startingPoints.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </CaseSection>

        <CaseSection title="Från upplevelse till handling." eyebrow="Kommunikationsstrategi">
          <div className="nordvik-flow-cards">
            {communicationSteps.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </CaseSection>

        <CaseSection title="Designbeslut som håller ihop upplevelsen." eyebrow="Designprinciper">
          <div className="nordvik-card-grid">
            {designPrinciples.map((principle) => (
              <article className="nordvik-text-card" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </CaseSection>

        <CaseSection title="Skandinavisk värme. Arkitektonisk precision." eyebrow="Visuell riktning">
          <div className="nordvik-visual-direction">
            <div>
              <p>
                Färg, typografi och bildspråk är valda för att förmedla långsiktighet,
                materialkänsla och en sober premiumposition.
              </p>
              <div className="nordvik-type-samples" aria-label="Typografiska exempel">
                <div>
                  <span>Elegant serif för rubriker</span>
                  <strong>Platser med värde över tid.</strong>
                </div>
                <div>
                  <span>Modern sans-serif för UI och brödtext</span>
                  <p>Projektinformation, fakta och CTA:er behöver kännas tydliga och enkla.</p>
                </div>
              </div>
            </div>
            <div className="nordvik-palette">
              {palette.map((color) => (
                <div key={color.name}>
                  <span style={{ backgroundColor: color.value }} />
                  <p>{color.name}</p>
                </div>
              ))}
            </div>
          </div>
        </CaseSection>

        <CaseSection
          title="En tydlig väg från inspiration till intresse."
          eyebrow="Informationsarkitektur"
        >
          <div className="nordvik-ia-flow" aria-label="Informationsarkitektur">
            {[
              "Startsida",
              "Utforska projekt",
              "Fördjupa sig i projekt",
              "Hållbarhet och fakta",
              "Intresseanmälan / Kontakt",
            ].map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
          <p className="nordvik-section-copy">
            Strukturen prioriterar förståelse och förtroende före konvertering, men håller alltid
            nästa relevanta steg nära till hands.
          </p>
        </CaseSection>

        <CaseSection title="En digital upplevelse byggd för förtroende." eyebrow="Slutlig design">
          <figure className="nordvik-final-design">
            <img
              alt="Nordvik Fastigheter komplett desktopdesign med hero, innehållssektioner, projekt, hållbarhetsbevis och formulär."
              src={finalDesignImage}
              loading="lazy"
            />
          </figure>
          <div className="nordvik-card-grid nordvik-final-notes">
            {finalNotes.map((note) => (
              <article className="nordvik-text-card" key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </article>
            ))}
          </div>
        </CaseSection>

        <CaseSection title="Utformad för alla skärmar." eyebrow="Responsivt tänk">
          <p className="nordvik-section-copy">
            Nordvik-konceptet är planerat med en responsiv innehållshierarki där navigation, CTA:er,
            projektinformation och typografi prioriteras om för mindre skärmar.
          </p>
          <div className="nordvik-pill-grid">
            {responsiveCards.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </CaseSection>

        <CaseSection title="Designad för att kunna byggas." eyebrow="Implementationstänk">
          <div className="nordvik-card-grid">
            {implementationCards.map((item) => (
              <article className="nordvik-text-card" key={item}>
                <h3>{item}</h3>
                <p>
                  En tydlig plan för hur designen kan översättas till robust frontend utan att
                  tappa känslan i upplevelsen.
                </p>
              </article>
            ))}
          </div>
          <p className="nordvik-section-copy">
            Konceptet är planerat med semantisk HTML, tydlig fokusnavigering, bildoptimering,
            återhållsamma animationer och återanvändbara komponenter för projektkort, CTA:er,
            navigation och formulär.
          </p>
        </CaseSection>

        <section className="nordvik-closing" data-reveal>
          <div>
            <p className="eyebrow">Slutsats</p>
            <h2>Ett fiktivt case. Ett verkligt arbetssätt.</h2>
            <p>
              Nordvik är ett självinitierat koncept, men processen speglar hur jag arbetar med
              digitala upplevelser - från strategi och struktur till design och implementation.
            </p>
          </div>
          <div className="nordvik-closing-actions">
            <Link className="button button-primary" to="/contact">
              <span>Låt oss prata om ditt projekt</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/projects">
              Se fler projekt
            </Link>
          </div>
        </section>
      </main>
    </article>
  );
}
