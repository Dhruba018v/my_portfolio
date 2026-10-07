"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { LuCheck, LuCopy, LuLoaderCircle, LuMail, LuSend } from "react-icons/lu";
import { profile, socials } from "@/lib/data";
import { validateContact, type ContactErrors, type ContactFields } from "@/lib/validation";
import { Location } from "./Location";
import { useToast } from "./Toast";
import { Reveal, SectionHeading, SocialLink } from "./ui";

const empty: ContactFields = { name: "", email: "", subject: "", message: "" };

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[30rem] bg-gradient-to-t from-brand-1/10 to-transparent"
      />
      <div className="container-page">
        <SectionHeading
          id="contact-title"
          eyebrow="05 — Contact"
          title={
            <>
              Have a project in mind? <span className="text-gradient">Let&apos;s talk.</span>
            </>
          }
          description="Whether it's a full-time role, a freelance build, or just a question — my inbox is open. I usually reply within 24 hours."
        />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <EmailCard />
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">Find me online</h3>
              <ul className="mt-4 space-y-3">
                {socials.map((s) => (
                  <li key={s.key} className="flex items-center gap-3">
                    <SocialLink k={s.key} label={s.label} href={s.href} />
                    <div className="text-sm">
                      <p className="font-medium">{s.label}</p>
                      <p className="text-muted">{s.handle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Location />
      </div>
    </section>
  );
}

function EmailCard() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      toast({ kind: "success", title: "Email copied", message: profile.email });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ kind: "error", title: "Couldn't copy", message: "Your browser blocked clipboard access." });
    }
  }

  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="font-display text-lg font-semibold">Email me directly</h3>
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/60 p-1.5 pl-4 dark:border-white/10 dark:bg-white/[0.03]">
        <LuMail aria-hidden className="text-muted size-4 shrink-0" />
        <a
          href={`mailto:${profile.email}`}
          className="min-w-0 flex-1 text-xs font-medium [overflow-wrap:anywhere] hover:underline min-[360px]:text-sm"
        >
          {/* On narrow screens, prefer wrapping right before the "@". */}
          {profile.email.split("@")[0]}
          <wbr />@{profile.email.split("@")[1]}
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Email address copied" : "Copy email address"}
          className={clsx(
            "relative grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
            copied ? "bg-emerald-500 text-white" : "bg-accent text-white hover:bg-accent-hover dark:text-ink-950",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "check" : "copy"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {copied ? <LuCheck className="size-4" /> : <LuCopy className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

function ContactForm() {
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactFields>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFields, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending">("idle");

  const update = (k: keyof ContactFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validateContact(next));
  };
  const blur = (k: keyof ContactFields) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateContact(values));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateContact(values);
    setErrors(errs);
    setTouched({ name: true, email: true, subject: true, message: true });
    const firstInvalid = (Object.keys(empty) as (keyof ContactFields)[]).find((k) => errs[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      toast({
        kind: "success",
        title: "Message sent!",
        message: `Thanks ${values.name.split(" ")[0]} — I'll get back to you soon.`,
      });
      setValues(empty);
      setTouched({});
      setErrors({});
    } catch {
      toast({ kind: "error", title: "Something went wrong", message: `Please try again or email ${profile.email}.` });
    } finally {
      setStatus("idle");
    }
  }

  const show = (k: keyof ContactFields) => (touched[k] ? errors[k] : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="glass rounded-3xl p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          value={values.name}
          error={show("name")}
          valid={touched.name && !errors.name}
          onChange={update("name")}
          onBlur={blur("name")}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={show("email")}
          valid={touched.email && !errors.email}
          onChange={update("email")}
          onBlur={blur("email")}
        />
        <div className="sm:col-span-2">
          <Field
            label="Subject"
            name="subject"
            value={values.subject}
            error={show("subject")}
            valid={touched.subject && !errors.subject}
            onChange={update("subject")}
            onBlur={blur("subject")}
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Message"
            name="message"
            multiline
            value={values.message}
            error={show("message")}
            valid={touched.message && !errors.message}
            onChange={update("message")}
            onBlur={blur("message")}
            hint={`${values.message.trim().length} / 20 min characters`}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-muted text-xs">All fields are required.</p>
        <button type="submit" disabled={status === "sending"} className="btn-primary px-6 py-3">
          {status === "sending" ? (
            <>
              <LuLoaderCircle aria-hidden className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <LuSend aria-hidden className="size-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: keyof ContactFields;
  value: string;
  error?: string;
  valid?: boolean;
  hint?: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
};

function Field({
  label,
  name,
  value,
  error,
  valid,
  hint,
  type = "text",
  autoComplete,
  multiline,
  onChange,
  onBlur,
}: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;

  const cls = clsx(
    "w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-none",
    "focus:ring-4 dark:bg-ink-950/50 dark:text-white dark:placeholder:text-slate-500",
    error
      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
      : valid
        ? "border-emerald-500/70 focus:border-emerald-500 focus:ring-emerald-500/20"
        : "border-slate-300 focus:border-accent focus:ring-accent/20 dark:border-white/15 dark:focus:border-accent-soft",
  );

  const common = {
    id,
    name,
    value,
    onChange,
    onBlur,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: cls,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between text-sm font-medium">
        {label}
        {valid && <LuCheck aria-hidden className="size-4 text-emerald-500" />}
      </label>
      {multiline ? (
        <textarea
          {...common}
          rows={6}
          placeholder="Tell me about your project, timeline, and goals…"
          className={clsx(cls, "resize-y")}
        />
      ) : (
        <input
          {...common}
          type={type}
          autoComplete={autoComplete}
          placeholder={name === "email" ? "you@company.com" : undefined}
        />
      )}
      <div className="mt-1.5 flex min-h-5 items-start justify-between gap-3 text-xs">
        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-medium text-rose-600 dark:text-rose-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {hint && (
          <p id={hintId} className="text-muted ml-auto shrink-0">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
