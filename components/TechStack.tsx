"use client";

import type { IconType } from "react-icons";
import { FaJava } from "react-icons/fa6";
import {
  LuBrainCircuit,
  LuCodeXml,
  LuDatabase,
  LuGlobe,
  LuScanSearch,
  LuSigma,
  LuTrafficCone,
  LuTrees,
} from "react-icons/lu";
import {
  SiC,
  SiCss,
  SiDjango,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiNumpy,
  SiPython,
  SiScikitlearn,
  SiTailwindcss,
} from "react-icons/si";
import { skillGroups, type Skill } from "@/lib/data";
import { SectionHeading, TiltCard } from "./ui";

// Brand colours for logos; "currentColor" follows the text colour.
const icons: Record<string, { Icon: IconType; color: string }> = {
  c: { Icon: SiC, color: "#5C6BC0" },
  java: { Icon: FaJava, color: "#E76F00" },
  python: { Icon: SiPython, color: "#3776AB" },
  html: { Icon: SiHtml5, color: "#E34F26" },
  css: { Icon: SiCss, color: "#663399" },
  js: { Icon: SiJavascript, color: "#E8B500" },
  django: { Icon: SiDjango, color: "#0C8A5E" },
  tailwind: { Icon: SiTailwindcss, color: "#06B6D4" },
  math: { Icon: LuSigma, color: "currentColor" },
  ml: { Icon: LuTrees, color: "currentColor" },
  xai: { Icon: LuScanSearch, color: "currentColor" },
  sumo: { Icon: LuTrafficCone, color: "#F97316" },
  sql: { Icon: LuDatabase, color: "#0E7FC0" },
  git: { Icon: SiGit, color: "#F05032" },
  numpy: { Icon: SiNumpy, color: "#4D77CF" },
  sklearn: { Icon: SiScikitlearn, color: "#F7931E" },
};

const groupIcons: Record<string, IconType> = { code: LuCodeXml, web: LuGlobe, ai: LuBrainCircuit };

export function TechStack() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative overflow-x-clip py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-96 max-w-4xl rounded-full bg-brand-1/10 blur-[120px]"
      />
      <div className="container-page">
        <SectionHeading
          id="skills-title"
          eyebrow="04 — Skills & Learning"
          title={
            <>
              My learning <span className="text-gradient">toolkit</span>
            </>
          }
          description="The languages, tools and foundations I've learned so far as a student — and keep building on."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {skillGroups.map((g, gi) => {
            const GroupIcon = groupIcons[g.icon] ?? LuCodeXml;
            return (
              <TiltCard
                key={g.title}
                max={4}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: gi * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="glass relative rounded-3xl p-6 transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:shadow-brand-1/15 md:p-7 dark:hover:border-white/20 dark:hover:shadow-black/50"
              >
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent-strong dark:text-accent-soft">
                    <GroupIcon aria-hidden className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{g.title}</h3>
                    <p className="text-muted text-sm">{g.blurb}</p>
                  </div>
                </div>
                <ul className="flex flex-wrap gap-2.5">
                  {g.skills.map((s) => (
                    <SkillBadge key={s.name} skill={s} />
                  ))}
                </ul>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkillBadge({ skill }: { skill: Skill }) {
  const { Icon, color } = icons[skill.icon] ?? icons.math;

  return (
    <li className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/60 px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-1/40 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand-1/40">
      <Icon
        aria-hidden
        className="text-accent-adaptive size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110"
        style={color === "currentColor" ? undefined : { color }}
      />
      <span className="whitespace-nowrap">{skill.name}</span>
    </li>
  );
}
