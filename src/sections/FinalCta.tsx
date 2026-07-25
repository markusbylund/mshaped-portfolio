import { ButtonLink } from "../components/ButtonLink";

export function FinalCta() {
  return (
    <section className="section final-cta-section" data-reveal>
      <div className="container final-cta">
        <div>
          <p className="eyebrow">Nästa steg</p>
          <h2>Redo att ta nästa steg?</h2>
          <p>Låt oss bygga något som gör skillnad för din verksamhet.</p>
        </div>
        <ButtonLink to="/contact">Boka ett samtal</ButtonLink>
      </div>
    </section>
  );
}
