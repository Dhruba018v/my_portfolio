"use client";

import clsx from "clsx";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { LuArrowUpRight, LuCalendar, LuGraduationCap, LuMapPin } from "react-icons/lu";
import { education, type EducationItem } from "@/lib/data";
import { SectionHeading, TiltCard } from "./ui";

export function Education() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="education" aria-labelledby="education-title" className="relative overflow-x-clip py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="education-title"
          eyebrow="02 — Education"
          title="Where I'm learning"
          description="My academic path — the foundation for everything I research and build."
        />

        <div className="relative">
          {/* Rail + scroll-linked progress */}
          <div
            aria-hidden
            className="absolute top-2 bottom-2 left-[11px] w-px bg-slate-300/70 md:left-1/2 dark:bg-white/10"
          />
          <motion.div
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-gradient-to-b from-brand-1 via-brand-2 to-brand-3 md:left-1/2"
          />

          <ol ref={listRef} className="space-y-12 md:space-y-16">
            {education.map((item, i) => (
              <TimelineItem key={`${item.institution}-${item.degree}`} item={item} side={i % 2 === 0 ? "left" : "right"} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, side }: { item: EducationItem; side: "left" | "right" }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const lit = inView || item.current;

  return (
    <li ref={ref} className="relative grid pl-10 md:grid-cols-2 md:gap-16 md:pl-0">
      {/* Dot */}
      <span
        aria-hidden
        className={clsx(
          "absolute top-1.5 left-0 grid size-[23px] place-items-center rounded-full border-2 bg-cream transition-all duration-500 md:left-1/2 md:-translate-x-1/2 dark:bg-ink-950",
          lit ? "scale-110 border-accent ring-6 ring-accent/15" : "border-slate-300 dark:border-white/20",
        )}
      >
        <span
          className={clsx("size-2 rounded-full transition-colors duration-500", lit ? "bg-accent" : "bg-transparent")}
        />
      </span>

      {/* Date column (desktop) */}
      <div className={clsx("hidden pt-1 md:block", side === "left" ? "md:order-2" : "md:order-1 md:text-right")}>
        <Meta item={item} align={side === "left" ? "left" : "right"} />
      </div>

      <TiltCard
        as="article"
        max={5}
        initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          "glass group relative rounded-3xl p-6 transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:shadow-brand-1/15 md:p-7 dark:hover:border-white/20 dark:hover:shadow-black/50",
          side === "left" ? "md:order-1" : "md:order-2",
        )}
      >
        <div className="mb-3 md:hidden">
          <Meta item={item} align="left" />
        </div>
        <div className="flex items-start gap-3">
          <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-strong min-[400px]:grid dark:text-accent-soft">
            <LuGraduationCap aria-hidden className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl font-semibold tracking-tight">{item.degree}</h3>
              {item.current && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Current
                </span>
              )}
            </div>
            <p className="mt-1 font-medium">
              {item.institutionUrl ? (
                <a
                  href={item.institutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-adaptive inline-flex items-center gap-0.5 hover:underline"
                >
                  {item.institution}
                  <LuArrowUpRight aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <span className="text-accent-adaptive">{item.institution}</span>
              )}
            </p>
          </div>
        </div>
        <p className="text-muted mt-4 text-sm leading-relaxed">{item.summary}</p>
        {item.highlights.length > 0 && (
          <ul className="mt-4 space-y-2">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm leading-relaxed">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        {item.subjects.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Subjects and focus areas">
            {item.subjects.map((t) => (
              <li key={t} className="badge">
                {t}
              </li>
            ))}
          </ul>
        )}
      </TiltCard>
    </li>
  );
}

function Meta({ item, align }: { item: EducationItem; align: "left" | "right" }) {
  return (
    <div className={clsx("flex flex-col gap-1 text-sm", align === "right" && "md:items-end")}>
      <p className="inline-flex items-center gap-1.5 font-mono font-semibold">
        <LuCalendar aria-hidden className="text-accent-adaptive size-3.5" />
        {item.period}
      </p>
      {item.location &&
        (item.mapQuery ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps"
            className="text-muted inline-flex items-start gap-1.5 transition-colors hover:text-accent-strong hover:underline dark:hover:text-accent-soft"
          >
            <LuMapPin aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {item.location}
            <span className="sr-only">(opens Google Maps in a new tab)</span>
          </a>
        ) : (
          <p className="text-muted inline-flex items-center gap-1.5">
            <LuMapPin aria-hidden className="size-3.5" />
            {item.location}
          </p>
        ))}
    </div>
  );
}
