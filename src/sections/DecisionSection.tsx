import { ButtonLink } from "../components/ButtonLink";

const questions = [
  {
    question: "Hur mycket kostar en hemsida?",
    answer:
      "Det beror på omfattning, innehåll och teknik. Vi börjar med ett kort samtal där jag förstår behovet och kan ge en tydlig rekommendation innan ni bestämmer er.",
  },
  {
    question: "Hur lång tid tar det?",
    answer:
      "En fokuserad landningssida kan gå snabbt, medan en större webbplats behöver mer struktur och innehållsarbete. Målet är alltid en tydlig plan med synliga steg.",
  },
  {
    question: "Kan jag själv uppdatera hemsidan?",
    answer:
      "Ja, om det är viktigt för er bygger vi lösningen så att innehåll kan hanteras på ett enkelt sätt via CMS eller en annan passande struktur.",
  },
  {
    question: "Arbetar du med SEO?",
    answer:
      "Ja. Jag fokuserar på teknisk grund, struktur, prestanda och tydligt innehåll så att sidan får bättre förutsättningar att synas och konvertera.",
  },
  {
    question: "Hur kommer vi igång?",
    answer:
      "Boka ett kostnadsfritt samtal. Vi går igenom nuläge, målgrupp och vad webbplatsen behöver göra för företaget. Efter det får ni ett konkret nästa steg.",
  },
];

export function DecisionSection() {
  return (
    <section className="section decision-section" data-reveal>
      <div className="container decision-grid">
        <div className="faq-panel">
          <p className="eyebrow">Vanliga frågor</p>
          <div className="faq-list">
            {questions.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <a className="text-link faq-more" href="/contact">
            Se alla frågor
          </a>
        </div>

        <div className="decision-cta">
          <div>
            <p className="eyebrow">Nästa steg</p>
            <h2>Redo att ta nästa steg?</h2>
            <p>
              Boka ett kostnadsfritt 20-minuters samtal så går vi igenom er hemsida, era mål och
              hur jag kan hjälpa er att få bättre resultat.
            </p>
          </div>

          <ButtonLink to="/contact">Boka ett kostnadsfritt samtal</ButtonLink>

          <ul className="decision-trust">
            <li>Inga förpliktelser</li>
            <li>Svar inom 24 timmar</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
