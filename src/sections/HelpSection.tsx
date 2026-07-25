import { services } from "../data/services";

export function HelpSection() {
  return (
    <section
      className="section soft-section"
      data-nav-section="/services"
      data-reveal
      id="tjanster"
    >
      <div className="container section-heading">
        <div>
          <p className="eyebrow">Så kan jag hjälpa er</p>
          <h2>Tjänster som skapar värde</h2>
        </div>
      </div>

      <div className="container service-grid">
        {services.map(({ title, description, deliverables, icon: Icon }) => (
          <article className="service-card" key={title}>
            <div className="service-icon">
              <Icon size={22} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <ul className="service-deliverables">
              {deliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
