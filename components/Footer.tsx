"use client";

import { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";
import { navLinks, profile, socials } from "@/lib/data";
import { ResumeLink } from "./ResumeLink";
import { Avatar, SocialLink } from "./ui";

export function Footer() {
  // Computed on the client so a statically built page never shows a stale year.
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="border-t border-slate-200 py-12 dark:border-white/10">
      <div className="container-page flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <a href="#top" className="flex items-center gap-2.5">
            <Avatar size={38} />
            <span className="font-display font-semibold">{profile.name}</span>
          </a>
          <p className="text-muted mt-3 text-sm">
            {profile.role}. Building thoughtful software from {profile.location}.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-muted transition-colors hover:text-slate-900 dark:hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <ResumeLink className="text-muted cursor-pointer transition-colors hover:text-slate-900 dark:hover:text-white">
                Resume
              </ResumeLink>
            </li>
          </ul>
        </nav>

        <div className="flex gap-2.5">
          {socials.map((s) => (
            <SocialLink key={s.key} k={s.key} label={s.label} href={s.href} />
          ))}
        </div>
      </div>

      <div className="container-page mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-slate-200 pt-6 text-sm sm:flex-row sm:items-center dark:border-white/10">
        <p className="text-muted">
          © {year ?? ""} {profile.name}. All rights reserved.
        </p>
        <a
          href="#top"
          className="group text-muted inline-flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-white"
        >
          Back to top
          <LuArrowUp aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
}
