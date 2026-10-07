export type ContactFields = { name: string; email: string; subject: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the client form and the API route. */
export function validateContact(f: ContactFields): ContactErrors {
  const e: ContactErrors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name (at least 2 characters).";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Please enter a valid email address.";
  if (f.subject.trim().length < 3) e.subject = "Add a short subject (at least 3 characters).";
  if (f.message.trim().length < 20) e.message = "Tell me a bit more — at least 20 characters.";
  else if (f.message.length > 5000) e.message = "Please keep your message under 5,000 characters.";
  return e;
}
