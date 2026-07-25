import { Code2, Diamond, Search, TrendingUp } from "lucide-react";

const processSteps = [
  {
    number: "01",
    title: "Förstå",
    description: "Vi ringar in målgruppen, affärsproblemet och vad besökaren behöver förstå.",
    icon: Search,
  },
  {
    number: "02",
    title: "Forma",
    description: "Struktur, flöden och visuella beslut gör idén konkret innan detaljer låses.",
    icon: Diamond,
  },
  {
    number: "03",
    title: "Bygga",
    description: "Lösningen utvecklas responsivt, tillgängligt och med utrymme att växa.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Växa",
    description: "Vi optimerar, förbättrar och prioriterar nästa steg för långsiktig utveckling.",
    icon: TrendingUp,
  },
];

export function ProcessSection() {
  return (
    <section className="section process-section" data-reveal id="process">
      <div className="container process-header">
        <p className="eyebrow">Så hjälper jag dig</p>
        <h2>Från insikt till resultat.</h2>
      </div>

      <div className="container process-layout">
        <div className="process-heading">
          <p className="eyebrow">Mitt sätt att arbeta</p>
          <h2>Bredden att se helheten. Djupet att lösa det som verkligen spelar roll.</h2>
          <p>
            Mshaped är mer än en logotyp - det är mitt arbetssätt. Jag kombinerar strategisk
            förståelse med kreativ design och teknisk precision för att skapa lösningar som håller.
          </p>
        </div>

        <ol className="process-list">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
            <li key={step.number}>
              <span className="process-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
              <div>
                <span className="process-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {index < processSteps.length - 1 ? <i aria-hidden="true" /> : null}
            </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
