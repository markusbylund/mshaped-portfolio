import { Linkedin, Mail, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { siteMeta } from "../data/site";

const initialForm = {
  name: "",
  email: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ "form-name": "contact", ...form }).toString(),
      });

      if (!response.ok) throw new Error("Form submission failed");
      setStatus("Tack! Ditt meddelande är skickat.");
      setForm(initialForm);
    } catch {
      setStatus(`Något gick fel. Mejla gärna direkt till ${siteMeta.email}.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        title="Har du ett projekt, en roll eller en idé?"
        description="Skicka ett kort meddelande så tar vi nästa steg. Jag återkommer så snart jag kan."
      />

      <section className="section">
        <div className="container contact-layout">
          <form
            className="contact-form"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            method="POST"
            name="contact"
            onSubmit={handleSubmit}
          >
            <input name="form-name" type="hidden" value="contact" />
            <p className="form-honeypot">
              <label>
                Lämna det här fältet tomt
                <input name="bot-field" tabIndex={-1} />
              </label>
            </p>
            <label>
              Namn
              <input
                name="name"
                required
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Ditt namn"
              />
            </label>

            <label>
              Email
              <input
                name="email"
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="din@email.se"
              />
            </label>

            <label>
              Meddelande
              <textarea
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Berätta kort vad du vill bygga eller prata om."
              />
            </label>

            <button className="button button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Skickar..." : "Skicka meddelande"}
            </button>
            {status ? (
              <p aria-live="polite" className="form-status">
                {status}
              </p>
            ) : null}
          </form>

          <aside className="contact-card">
            <h2>Direktkontakt</h2>
            <p>Föredrar du att skriva direkt går det lika bra via e-post eller LinkedIn.</p>
            <div className="contact-links">
              <a href={`mailto:${siteMeta.email}`}>
                <Mail size={18} />
                {siteMeta.email}
              </a>
              <a href={siteMeta.linkedIn} target="_blank" rel="noreferrer">
                <Linkedin size={18} />
                LinkedIn
              </a>
              <a href={`tel:${siteMeta.phone}`}>
                <Phone size={18} />
                {siteMeta.phoneLabel}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
