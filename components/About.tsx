"use client";

import { about } from "@/lib/data";
import { ProfileFlipCard } from "./ProfileFlipCard";
import { Reveal, SectionHeading, TiltCard } from "./ui";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          id="about-title"
          eyebrow="01 — About"
          title={
            <>
              {about.title.first} <span className="text-gradient sm:block">{about.title.second}</span>
            </>
          }
        />

        {/* min-w-0: let columns shrink to the screen instead of widening the page on small phones */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16 [&>*]:min-w-0">
          <Reveal className="space-y-5 text-lg leading-relaxed">
            {about.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "text-slate-800 dark:text-slate-200" : "text-muted"}>
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="w-full max-w-lg justify-self-center lg:justify-self-end">
            <ProfileFlipCard />
          </Reveal>
        </div>

        {/* How I approach my work */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <h3 className="mb-8 font-display text-2xl font-semibold tracking-tight">{about.principlesTitle}</h3>
          </Reveal>
          <ul className="grid gap-5 md:grid-cols-3">
            {about.principles.map((pr, i) => (
              <TiltCard
                as="li"
                key={pr.title}
                className="glass group relative flex h-full flex-col rounded-3xl p-6 transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:shadow-brand-1/15 dark:hover:border-white/20 dark:hover:shadow-black/50"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-gradient font-display text-4xl font-bold">0{i + 1}</span>
                <p className="mt-4 font-display text-xl font-semibold tracking-tight">{pr.title}</p>
                <p className="text-muted mt-2 leading-relaxed">{pr.text}</p>
              </TiltCard>
            ))}
          </ul>
        </div>
      </div>
      
    </section>
  );
}
