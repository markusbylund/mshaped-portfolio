import { PageHeader } from "../components/PageHeader";
import { skills } from "../data/skills";

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="Om mig"
        title="Jag kombinerar utveckling, UX och teknisk nyfikenhet"
        description="Min styrka ligger i att bryta ner problem, förstå sammanhang och bygga digitala lösningar som människor faktiskt kan använda."
      />

      <section className="section">
        <div className="container two-column">
          <div className="prose">
            <h2>Professionellt fokus</h2>
            <p>
              Jag är en tekniskt nyfiken problemlösare med en filosofie kandidatexamen i
              informationsarkitektur med inriktning mot frontend, webbutveckling och UX från
              Högskolan i Borås. Jag trivs där teknik, människor och struktur möts.
            </p>
            <p>
              I min verktygslåda finns JavaScript, TypeScript, React, HTML, CSS, API:er, Git och
              GitHub. Samtidigt är jag nyfiken på det som händer bakom gränssnittet: systemmiljöer,
              automation, AI och hur teknik kan användas för att förenkla verkliga arbetsflöden.
            </p>
            <p>
              Jag har över tio års arbetslivserfarenhet från logistik och säkerhetskritisk
              verksamhet, där ansvar, struktur, samarbete och problemlösning under press varit en
              naturlig del av vardagen. Tidigare erfarenhet från service och kundkontakt har också
              gjort mig trygg i mötet med människor och olika behov.
            </p>
            <p>
              Jag söker sammanhang där jag får fortsätta växa inom modern IT, digital utveckling
              och automation. Jag lär mig snabbt, är prestigelös och tycker om att förstå hur olika
              delar hänger ihop innan jag föreslår en lösning.
            </p>
          </div>

          <aside className="skill-panel" aria-label="Tech stack">
            <h2>Tech stack</h2>
            <ul className="tag-list">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container learning-panel" data-reveal>
          <div>
            <p className="eyebrow">Arbetssätt och lärande</p>
            <h2>Jag bygger för att förstå</h2>
          </div>
          <div className="learning-copy">
            <p>
              Mitt intresse för teknik handlar om mer än att skriva kod. Jag tycker om att förstå
              hur system fungerar, hur olika delar hänger ihop och hur teknik kan användas för att
              lösa verkliga problem.
            </p>
            <p>
              Egna projekt är därför en viktig del av mitt lärande. Genom att bygga, testa och
              ibland misslyckas får jag möjlighet att utforska nya tekniker och omsätta teori till
              fungerande lösningar.
            </p>
            <p>
              För mig är programmering och teknik verktyg för att skapa, förenkla och förbättra.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
