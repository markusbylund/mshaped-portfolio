import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { siteMeta } from "../data/site";

const footerGroups = [
  {
    title: "Navigation",
    links: [
      { label: "Hem", href: "/" },
      { label: "Tjänster", href: "/services" },
      { label: "Case", href: "/projects" },
      { label: "Om mig", href: "/about" },
      { label: "Process", href: "/#process" },
      { label: "Kontakt", href: "/contact" },
    ],
  },
  {
    title: "Tjänster",
    links: [
      { label: "Ny hemsida", href: "/services" },
      { label: "Gör om befintlig hemsida", href: "/services" },
      { label: "Landningssidor", href: "/services" },
      { label: "Webbappar", href: "/services" },
      { label: "UX & design", href: "/services" },
      { label: "SEO & prestanda", href: "/services" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link className="brand footer-logo-lockup" to="/">
            <img src="/assets/brand/mshaped-mark-original.png" alt="" width="42" height="42" />
            <span>{siteMeta.name}</span>
          </Link>
          <p className="muted">
            Strategi, design och teknik som gör det enklare för företag att bli valda.
          </p>
        </div>

        <div className="footer-link-groups">
          {footerGroups.map((group) => (
            <nav className="footer-group" aria-label={group.title} key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map((item) => (
                <Link key={`${group.title}-${item.label}`} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <div className="footer-contact">
          <h2>Kontakt</h2>
          <p>Kungsbacka, Sverige</p>
          <a className="footer-email" href={`mailto:${siteMeta.email}`}>
            {siteMeta.email}
          </a>
          <a className="footer-email" href={`tel:${siteMeta.phone}`}>
            {siteMeta.phoneLabel}
          </a>
          <Link className="button button-secondary footer-cta" to="/contact">
            <span>Boka samtal</span>
          </Link>
          <div className="social-links" aria-label="Sociala länkar">
            <a href={siteMeta.linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href={siteMeta.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href={`mailto:${siteMeta.email}`} aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2024 M-shaped. Alla rättigheter förbehållna.</p>
        <div>
          <Link to="/contact">Integritetspolicy</Link>
          <Link to="/contact">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
