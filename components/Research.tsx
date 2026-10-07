"use client";

import clsx from "clsx";
import { LuArrowUpRight, LuCalendar, LuFlaskConical } from "react-icons/lu";
import { research, researchIntro, type ResearchStatus } from "@/lib/data";
import { Publications } from "./Publications";
import { Reveal, SectionHeading, TiltCard } from "./ui";

const statusStyle: Record<ResearchStatus, string> = {
  Exploring: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Ongoing: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Published: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
};

export function Research() {
  return (
    <section id="research" aria-labelledby="research-title" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="research-title"
          eyebrow="03 — Research Journey"
          title={
            <>
              Exploring the frontiers of <span className="text-gradient">AI</span>
            </>
          }
          description={researchIntro}
        />

        <ol className="grid gap-5 md:grid-cols-2">
          {research.map((r, i) => (
            <TiltCard
              as="li"
              key={r.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass group relative flex flex-col overflow-hidden rounded-3xl p-6 transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:shadow-brand-1/15 md:p-7 dark:hover:border-white/20 dark:hover:shadow-black/50"
            >
              {/* Soft corner glow on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 size-56 rounded-full bg-gradient-to-br from-brand-1/25 to-brand-2/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative flex items-center justify-between gap-3">
                <span className="text-gradient font-display text-4xl font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", statusStyle[r.status])}>
                  {r.status}
                </span>
              </div>

              <h3 className="relative mt-4 font-display text-xl font-semibold tracking-tight">{r.title}</h3>
              {r.period && (
                <p className="text-muted relative mt-1 inline-flex items-center gap-1.5 font-mono text-xs">
                  <LuCalendar aria-hidden className="size-3.5" /> {r.period}
                </p>
              )}
              <p className="text-muted relative mt-3 flex-1 text-sm leading-relaxed">{r.description}</p>

              <ul className="relative mt-5 flex flex-wrap gap-1.5" aria-label="Topics">
                {r.tags.map((t) => (
                  <li key={t} className="badge">
                    {t}
                  </li>
                ))}
              </ul>

              {r.links && r.links.length > 0 && (
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {r.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline px-4 py-1.5 text-xs"
                    >
                      {l.label} <LuArrowUpRight aria-hidden className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
            </TiltCard>
          ))}
        </ol>

        <Publications />

        <Reveal className="mt-8">
          <p className="text-muted flex items-center justify-center gap-2 text-center text-sm">
            <LuFlaskConical aria-hidden className="text-accent-adaptive size-4" />
            More research, papers and code coming soon.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
