import { ArrowUpRight, Code2, Diamond, Goal } from "lucide-react";
import { Link } from "react-router-dom";

const pillars = [
  {
    title: "Strategi",
    description: "Jag förstår affären, målen och användaren.",
    icon: Goal,
  },
  {
    title: "Design",
    description: "Jag skapar upplevelser som bygger förtroende.",
    icon: Diamond,
  },
  {
    title: "Teknik",
    description: "Jag utforskar kod, system och automation för att lösa praktiska problem.",
    icon: Code2,
  },
];

export function AboutPreview() {
  return (
    <section className="section about-preview" data-reveal>
      <div className="container about-preview-grid">
        <div className="about-brand-image">
          <img
            alt="Abstrakt Mshaped-komposition där designytor och tekniska gridlinjer formar bokstaven M."
            loading="lazy"
            src="/assets/brand/mshaped-gold-logo.webp"
          />
          <span>Design · UX · Frontend</span>
        </div>

        <div className="about-preview-copy">
          <p className="eyebrow">Mitt sätt att arbeta</p>
          <h2>Bredden att se helheten. Djupet att lösa det som verkligen spelar roll.</h2>
          <p>
            Jag heter Markus och kombinerar frontend, UX och digital utveckling med struktur,
            ansvar och teknisk nyfikenhet. Jag tycker om att förstå hur människor, gränssnitt,
            system och processer kan fungera bättre tillsammans.
          </p>
          <div className="about-pillars">
            {pillars.map(({ title, description, icon: Icon }) => (
              <article key={title}>
                <Icon size={24} aria-hidden="true" />
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
          <Link className="text-link inline-link" to="/about">
            Läs mer om mig
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
