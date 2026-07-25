import { Gauge, LayoutTemplate, RefreshCw, Target } from "lucide-react";

export const services = [
  {
    title: "Ny hemsida",
    description:
      "En modern, snabb och mobilanpassad webbplats som bygger förtroende och gör det enkelt att kontakta er.",
    deliverables: [
      "Strategi & struktur",
      "Design & utveckling",
      "SEO & prestanda",
      "Lansering & uppföljning",
    ],
    icon: LayoutTemplate,
  },
  {
    title: "Gör om er befintliga hemsida",
    description:
      "Vi förbättrar er nuvarande webbplats så att den blir tydligare, snabbare och bättre på att skapa förfrågningar.",
    deliverables: [
      "UX- & innehållsanalys",
      "Ny design & struktur",
      "Teknisk optimering",
      "Enkelt att uppdatera",
    ],
    icon: RefreshCw,
  },
  {
    title: "Landningssidor & kampanjsidor",
    description:
      "Fokuserade sidor för kampanjer, tjänster eller produkter som driver trafik och skapar resultat.",
    deliverables: ["Konverteringsfokus", "Tydligt budskap", "Snabb leverans", "Spårning & mätning"],
    icon: Target,
  },
  {
    title: "Webbappar & digitala produkter",
    description:
      "När behovet är mer avancerat bygger jag även interaktiva webbappar och prototyper med tydliga flöden.",
    deliverables: ["Produktflöden", "React & TypeScript", "Datakopplingar", "Tillgängliga gränssnitt"],
    icon: Gauge,
  },
];
