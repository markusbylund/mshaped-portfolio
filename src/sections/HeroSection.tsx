import { ButtonLink } from "../components/ButtonLink";

const trustItems = ["Direktkontakt", "Tydlig process", "Inga förpliktelser"];

export function HeroSection() {
  return (
    <section className="hero-section" data-nav-section="/" id="hem">
      <div className="hero-backdrop" aria-hidden="true">
        <picture>
          <source media="(max-width: 640px)" srcSet="/assets/hero/mshaped-hero-mobile.webp" />
          <img src="/assets/hero/mshaped-hero-desktop.webp" alt="" />
        </picture>
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Webbplatser som skapar resultat</p>
          <h1>
            En hemsida som gör det enklare för rätt kunder att <em>välja er.</em>
          </h1>
          <p className="lead">
            Jag hjälper små och växande företag att få en modern, snabb och tydlig webbplats som
            bygger förtroende och skapar fler förfrågningar.
          </p>

          <div className="hero-actions">
            <ButtonLink to="/contact">Boka ett kostnadsfritt samtal</ButtonLink>
            <ButtonLink to="/projects" variant="secondary">
              Se exempel på mitt arbete
            </ButtonLink>
          </div>

          <ul className="hero-trust" aria-label="Trygghet i samarbetet">
            {trustItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
