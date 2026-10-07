import { NextResponse } from "next/server";
import { validateContact, type ContactFields } from "@/lib/validation";

export async function POST(req: Request) {
  let body: Partial<ContactFields>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const fields: ContactFields = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    subject: String(body.subject ?? ""),
    message: String(body.message ?? ""),
  };

  const errors = validateContact(fields);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // TODO: deliver the message — e.g. Resend, Postmark, SendGrid, or a Slack webhook:
  // await resend.emails.send({ from: "...", to: profile.email, replyTo: fields.email, subject: fields.subject, text: fields.message });
  console.log("[contact] new message", { from: fields.email, subject: fields.subject });

  return NextResponse.json({ ok: true });
}
