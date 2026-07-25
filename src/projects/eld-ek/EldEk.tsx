import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Gem,
  MapPin,
  Sparkles,
  Utensils,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./eld-ek.css";

const finalDesignImage = "/assets/cases/eld-ek/eld-ek-final-design.png";

const projectFacts = [
  { label: "Bransch", value: "Restaurang & upplevelse" },
  { label: "Fokus", value: "UX/UI, copywriting och konvertering" },
  { label: "Format", value: "Konceptuell webbdesign" },
  { label: "År", value: "2026" },
];

const challengePoints = [
  "Skapa exklusivitet utan att bli otillgänglig.",
  "Förmedla hantverk och personlighet med ett fåtal visuella element.",
  "Göra bokningsresan enkel för både spontana gäster och planerade sällskap.",
];

const personas = [
  {
    title: "Upplevelsesökaren",
    text: "Letar efter en minnesvärd middag för dejt, firande eller en speciell kväll.",
  },
  {
    title: "Affärsgästen",
    text: "Behöver snabbt förstå restaurangens nivå, läge, öppettider och möjligheter för större sällskap.",
  },
  {
    title: "Den spontana bokaren",
    text: "Vill veta nästa lediga tid, prisbild och boka utan att leta efter information.",
  },
];

const strategyCards = [
  {
    title: "Picture",
    heading: "Måla upp upplevelsen",
    text: "Hero-sektionen sätter scenen med levande ljus, öppen eld och nordiska råvaror. Besökaren ska direkt kunna föreställa sig kvällen.",
  },
  {
    title: "Promise",
    heading: "Tydliggör löftet",
    text: "Eld & Ek lovar en personlig smakresa där eld, säsong och hantverk står i centrum. Menyformat, pris och plats kommuniceras direkt.",
  },
  {
    title: "Prove",
    heading: "Bevisa kvaliteten",
    text: "Hantverket stärks genom köksmästaren, vinpaketen, restaurangens filosofi och social proof. Varje detalj ska förklara varför upplevelsen är värd att boka.",
  },
  {
    title: "Push",
    heading: "Gör nästa steg självklart",
    text: "Boka bord syns genom hela upplevelsen. Nästa lediga tid, pris, antal serveringar och praktisk bokningsinformation minskar osäkerheten och driver handling.",
  },
];

const flowSteps = [
  { title: "Känsla", text: "Hero och atmosfär" },
  { title: "Förståelse", text: "Meny, pris och restaurangens koncept" },
  { title: "Förtroende", text: "Köksmästare, vin och omdömen" },
  { title: "Beslut", text: "Tillgänglighet och praktisk information" },
  { title: "Handling", text: "Bokningsformulär och kontaktvägar" },
];

const visualPrinciples = [
  {
    icon: Flame,
    title: "Mörk grund",
    text: "Skapar lugn, fokus och en intim kvällskänsla.",
  },
  {
    icon: Sparkles,
    title: "Eld och gyllene detaljer",
    text: "Tillför värme, hantverk och visuell riktning i gränssnittet.",
  },
  {
    icon: Utensils,
    title: "Filmisk matfotografi",
    text: "Gör råvaror, texturer och serveringar till en del av berättelsen.",
  },
  {
    icon: Gem,
    title: "Editorial typografi",
    text: "Ger restaurangen karaktär och en mer exklusiv, redaktionell ton.",
  },
];

const solutionDecisions = [
  "Hero med pris, antal serveringar, plats och nästa lediga tid.",
  "Återkommande boknings-CTA för att undvika att användaren behöver leta.",
  "Sektioner som bygger förtroende innan bokningen: filosofi, köksmästare, vinpaket och omdömen.",
  "Ett bokningsformulär som lyfter allergier, specialönskemål och större sällskap.",
  "Kontaktinformation och öppettider samlade längst ned för enkel tillgång.",
];

const reflections = [
  "Atmosfär bygger intresse.",
  "Tydlighet bygger förtroende.",
  "En enkel bokningsresa driver handling.",
];

const roles = [
  "UX/UI-design",
  "Visuell identitet",
  "Informationsarkitektur",
  "UX-copy och 4P-strategi",
  "Konverteringsdesign",
  "Konceptutveckling",
];

function CaseSection({
  children,
  eyebrow,
  title,
  variant = "default",
}: {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  variant?: "default" | "narrow";
}) {
  return (
    <section className={`eld-case-section eld-case-section--${variant}`} data-reveal>
      <div className="eld-case-heading">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function EldEk() {
  return (
    <article className="eld-case-page">
      <header className="eld-hero">
        <div className="container eld-hero-inner">
          <div className="eld-hero-copy" data-reveal>
            <p className="eyebrow">Fiktivt UX/UI-case</p>
            <h1>Eld &amp; Ek</h1>
            <p className="eld-lead">
              En digital smakresa för en restaurang där modern nordisk mat möter öppen eld.
            </p>
            <p>
              Ett digitalt restaurangkoncept byggt för att skapa längtan före besöket - och göra
              vägen från inspiration till bokning självklar.
            </p>
          </div>

          <figure className="eld-main-visual" data-reveal>
            <img
              alt="Eld & Ek restaurangkoncept med mörk premiumdesign, eld, matbilder och bokningssektion."
              src={finalDesignImage}
              loading="eager"
            />
          </figure>

          <dl className="eld-fact-row" aria-label="Projektfakta" data-reveal>
            {projectFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <main className="container eld-case-content">
        <CaseSection
          title="En upplevelse som börjar före första serveringen"
          eyebrow="Caseöversikt"
          variant="narrow"
        >
          <p className="eld-section-copy eld-section-copy--large">
            Eld &amp; Ek är ett fiktivt webbkoncept för en exklusiv nordisk restaurang där elden är
            en del av både matlagningen och berättelsen. Målet var att skapa en digital upplevelse
            som inte bara visar en meny, utan bygger förväntan, förmedlar hantverket och gör
            bokningen enkel.
          </p>

          <div className="eld-summary-grid">
            <article>
              <span>Uppdraget</span>
              <p>Skapa en exklusiv restaurangsajt som stärker varumärket och driver fler bokningar.</p>
            </article>
            <article>
              <span>Resultatet</span>
              <p>
                En mörk, konverteringsdriven och redaktionell digital upplevelse med tydlig
                berättelse, praktisk information och återkommande bokningspunkter.
              </p>
            </article>
          </div>
        </CaseSection>

        <CaseSection title="Utmaningen: att sälja en känsla, inte bara ett bord" eyebrow="Problem">
          <div className="eld-editorial-split">
            <p className="eld-section-copy">
              För en restaurang med begränsat antal platser är webbplatsen ofta det första mötet med
              upplevelsen. Designutmaningen var att skapa rätt förväntan utan att göra sidan svår
              att använda. Besökaren ska känna atmosfären direkt, men samtidigt snabbt förstå meny,
              pris, tillgänglighet och hur bokningen fungerar.
            </p>
            <ul className="eld-check-list">
              {challengePoints.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </CaseSection>

        <CaseSection title="Designad för olika bokningsbehov" eyebrow="Designhypoteser">
          <div className="eld-note">
            <MapPin size={18} aria-hidden="true" />
            <p>Designhypoteser för ett fiktivt case, framtagna för att styra innehåll, flöde och ton.</p>
          </div>

          <div className="eld-card-grid eld-card-grid--three">
            {personas.map((persona) => (
              <article className="eld-text-card" key={persona.title}>
                <h3>{persona.title}</h3>
                <p>{persona.text}</p>
              </article>
            ))}
          </div>

          <blockquote className="eld-quote">
            Designen behövde därför kombinera emotionell storytelling med praktisk information
            redan tidigt i flödet.
          </blockquote>
        </CaseSection>

        <CaseSection title="Copy som leder från känsla till bokning" eyebrow="Strategi: 4P-modellen">
          <p className="eld-section-copy">
            Webbplatsens berättelse är strukturerad enligt 4P-modellen för att stegvis bygga
            intresse, förtroende och handling.
          </p>

          <div className="eld-strategy-list">
            {strategyCards.map((card, index) => (
              <article className="eld-strategy-card" key={card.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>{card.title}</p>
                  <h3>{card.heading}</h3>
                </div>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </CaseSection>

        <CaseSection title="Från inspiration till reservation" eyebrow="Informationsarkitektur">
          <div className="eld-flow" aria-label="Bokningsresa">
            {flowSteps.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <p className="eld-section-copy">
            Informationsarkitekturen är byggd för att besvara de viktigaste frågorna i rätt ordning:
            Vad är det här? Är det för mig? Vad kostar det? Kan jag boka? Hur gör jag nu?
          </p>
        </CaseSection>

        <CaseSection title="En varm tolkning av nordisk exklusivitet" eyebrow="Visuell riktning">
          <div className="eld-card-grid">
            {visualPrinciples.map((principle) => {
              const Icon = principle.icon;
              return (
                <article className="eld-icon-card" key={principle.title}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </article>
              );
            })}
          </div>
        </CaseSection>

        <CaseSection title="En sida med två uppgifter" eyebrow="Designlösningen">
          <div className="eld-solution-panel">
            <blockquote>
              Eld &amp; Ek ska både skapa begär och göra bokning enkel. Därför kombinerar sidan
              bilddriven storytelling med tydliga konverteringspunkter.
            </blockquote>
            <ul>
              {solutionDecisions.map((decision) => (
                <li key={decision}>
                  <span />
                  {decision}
                </li>
              ))}
            </ul>
          </div>
        </CaseSection>

        <CaseSection title="Den färdiga upplevelsen" eyebrow="Slutdesign">
          <figure className="eld-final-design">
            <img
              alt="Eld & Ek komplett design för ett fiktivt restaurangcase med hero, värdekort, innehållssektioner, social proof och bokningsyta."
              src={finalDesignImage}
              loading="lazy"
            />
            <figcaption>
              Slutdesignen balanserar restaurangens exklusiva atmosfär med en tydlig väg mot
              bokning.
            </figcaption>
          </figure>
        </CaseSection>

        <CaseSection title="Vad caset visar" eyebrow="Reflektion">
          <div className="eld-editorial-split">
            <p className="eld-section-copy">
              Eld &amp; Ek visar hur UX/UI, varumärkesberättelse och konverteringsfokus kan
              samverka i en premiumupplevelse. Konceptet är byggt för att göra en restaurangsajt
              till en förlängning av själva besöket - inte bara en plats för praktisk information.
            </p>
            <div className="eld-reflection-cards">
              {reflections.map((reflection) => (
                <article key={reflection}>{reflection}</article>
              ))}
            </div>
          </div>
        </CaseSection>

        <CaseSection title="Min roll i projektet" eyebrow="Ansvar">
          <ul className="eld-role-list">
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </CaseSection>

        <section className="eld-closing" data-reveal>
          <div>
            <p className="eyebrow">Nästa projekt</p>
            <h2>Vill du skapa en digital upplevelse som känns lika stark som ditt varumärke?</h2>
            <p>
              Jag hjälper företag att förvandla idéer och varumärken till tydliga, genomtänkta och
              konverteringsdrivna digitala upplevelser.
            </p>
          </div>
          <Link className="button button-primary" to="/contact">
            <span>Starta ett projekt</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </main>
    </article>
  );
}
