import { ButtonLink } from "../components/ButtonLink";

export function NotFound() {
  return (
    <section className="page-header">
      <div className="container narrow">
        <p className="eyebrow">404</p>
        <h1>Sidan finns inte</h1>
        <p className="lead">Länken verkar peka fel. Gå tillbaka till startsidan och fortsätt där.</p>
        <div className="hero-actions">
          <ButtonLink to="/">Till startsidan</ButtonLink>
        </div>
      </div>
    </section>
  );
}
