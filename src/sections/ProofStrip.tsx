const proofItems = [
  { value: "03", label: "Interaktiva case" },
  { value: "UX + kod", label: "Från flöde till frontend" },
  { value: "React", label: "Byggt för vidareutveckling" },
];

export function ProofStrip() {
  return (
    <section className="proof-strip" aria-label="Mshaped i korthet">
      <div className="container proof-grid">
        <p className="proof-intro">
          Designbeslut och frontend utvecklade tillsammans, med fokus på tydlighet och faktisk
          användning.
        </p>

        <dl className="proof-list">
          {proofItems.map((item) => (
            <div key={item.label}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
