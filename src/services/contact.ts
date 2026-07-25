import { siteMeta } from "../data/site";

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export function createMailtoLink({ name, email, message }: ContactFormValues) {
  const subject = encodeURIComponent(`Portfolio kontakt fran ${name}`);
  const body = encodeURIComponent(`${message}\n\nFran: ${name} <${email}>`);

  return `mailto:${siteMeta.email}?subject=${subject}&body=${body}`;
}
