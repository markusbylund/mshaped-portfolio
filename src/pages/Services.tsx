import { ButtonLink } from "../components/ButtonLink";
import { PageHeader } from "../components/PageHeader";
import { services } from "../data/services";

export function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Konsulttjänster"
        title="Frontendhjälp för webbplatser, appar och bättre UX"
        description="Tydliga insatser för företag som behöver bygga nytt, förbättra befintligt eller få fart på en frontend som vuxit sig svår."
      />

      <section className="section">
        <div className="container service-grid">
          {services.map(({ title, description, icon: Icon }) => (
            <article className="service-card large" key={title}>
              <div className="service-icon">
                <Icon size={24} />
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-band">
          <div>
            <p className="eyebrow">Nästa steg</p>
            <h2>Kontakta mig för offert</h2>
            <p>
              Berätta kort vad du vill bygga eller förbättra, så kan vi hitta en rimlig omfattning
              och första leverans.
            </p>
          </div>
          <ButtonLink to="/contact">Starta dialog</ButtonLink>
        </div>
      </section>
    </>
  );
}
