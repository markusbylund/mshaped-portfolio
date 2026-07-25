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

export function FaqSection() {
  return (
    <section className="section faq-section" data-reveal>
      <div className="container faq-layout">
        <div>
          <p className="eyebrow">Vanliga frågor</p>
          <h2>Tryggt att komma igång</h2>
        </div>

        <div className="faq-list">
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
