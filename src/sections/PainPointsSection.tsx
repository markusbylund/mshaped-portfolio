import { FileQuestion, PencilOff, SearchX, Smartphone, Wrench } from "lucide-react";

const painPoints = [
  {
    title: "Ser gammal ut i mobilen",
    description: "Besökare får inte ett professionellt första intryck.",
    icon: Smartphone,
  },
  {
    title: "Otydligt erbjudande",
    description: "Besökaren förstår inte vad ni erbjuder eller varför ni är rätt val.",
    icon: FileQuestion,
  },
  {
    title: "För få förfrågningar",
    description: "Webbplatsen får trafik, men leder inte till kontakt.",
    icon: SearchX,
  },
  {
    title: "Svår att uppdatera",
    description: "Det tar för lång tid att ändra innehåll eller lägga till nytt.",
    icon: Wrench,
  },
  {
    title: "Saknar tydlig riktning",
    description: "Design, struktur och innehåll drar inte åt samma håll.",
    icon: PencilOff,
  },
];

export function PainPointsSection() {
  return (
    <section className="pain-section" data-reveal>
      <div className="container pain-panel">
        <div className="pain-heading">
          <p className="eyebrow">Känner du igen dig?</p>
          <h2>Din hemsida ser okej ut, men hjälper den företaget att växa?</h2>
        </div>

        <div className="pain-grid">
          {painPoints.map(({ title, description, icon: Icon }) => (
            <article className="pain-card" key={title}>
              <Icon size={25} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>

        <p className="pain-note">
          Låt oss se vad som håller er tillbaka - boka ett <strong>kostnadsfritt samtal.</strong>
        </p>
      </div>
    </section>
  );
}
