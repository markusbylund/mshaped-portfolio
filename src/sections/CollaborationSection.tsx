import { ArrowUpRight, CheckCircle2, Code2, Pencil, Rocket, Search } from "lucide-react";
import { Link } from "react-router-dom";

const processSteps = [
  {
    number: "1.",
    title: "Förstå",
    description: "Vi lär känna ert företag, era mål och era kunder.",
    icon: Search,
  },
  {
    number: "2.",
    title: "Forma",
    description: "Vi tar fram strategi, struktur och design som gör skillnad.",
    icon: Pencil,
  },
  {
    number: "3.",
    title: "Bygga",
    description: "Vi utvecklar en snabb, säker och användarvänlig webbplats.",
    icon: Code2,
  },
  {
    number: "4.",
    title: "Växa",
    description: "Vi lanserar och hjälper er att fortsätta utvecklas och få resultat.",
    icon: Rocket,
  },
];

const partnerPoints = [
  "Direktkontakt genom hela projektet",
  "Strategi, design och teknik - allt på ett ställe",
  "Baserad i Kungsbacka, arbetar i hela Sverige",
  "Tydlig process och fasta projektplaner",
  "Hjälp även efter lansering",
];

export function CollaborationSection() {
  return (
    <section className="section collaboration-section" data-reveal id="process">
      <div className="container collaboration-grid">
        <div className="collaboration-panel process-panel">
          <p className="eyebrow">Så går samarbetet till</p>
          <h2>En enkel och trygg process</h2>

          <ol className="collaboration-steps">
            {processSteps.map(({ number, title, description, icon: Icon }, index) => (
              <li key={title}>
                <span className="collaboration-icon">
                  <Icon size={24} aria-hidden="true" />
                </span>
                {index < processSteps.length - 1 ? <i aria-hidden="true" /> : null}
                <strong>
                  <small>{number}</small>
                  {title}
                </strong>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="collaboration-panel partner-panel">
          <p className="eyebrow">Hej, jag heter Markus</p>
          <h2>Din partner från idé till resultat</h2>

          <div className="partner-content">
            <div className="partner-portrait" aria-hidden="true">
              <span>M</span>
            </div>

            <div>
              <p>
                Jag hjälper företag att omvandla otydliga idéer till webbplatser som bygger
                förtroende och skapar fler affärer.
              </p>
              <ul className="partner-list">
                {partnerPoints.map((point) => (
                  <li key={point}>
                    <CheckCircle2 size={17} aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link className="button button-secondary partner-link" to="/about">
            <span>Läs mer om mig</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
