import { BriefcaseBusiness, Building2, HeartPulse, Laptop, ShoppingCart, Utensils } from "lucide-react";

const industries = [
  { label: "Bygg & fastighet", icon: Building2 },
  { label: "Tjänsteföretag", icon: BriefcaseBusiness },
  { label: "Handel & e-handel", icon: ShoppingCart },
  { label: "Hälsa & skönhet", icon: HeartPulse },
  { label: "Teknik & SaaS", icon: Laptop },
  { label: "Restaurang & café", icon: Utensils },
];

export function IndustryStrip() {
  return (
    <section className="industry-strip" aria-label="Företag jag kan hjälpa">
      <div className="container industry-grid">
        <p className="eyebrow">Jag hjälper företag inom</p>
        {industries.map(({ label, icon: Icon }) => (
          <span key={label}>
            <Icon size={17} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
