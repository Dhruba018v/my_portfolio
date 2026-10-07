"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LuDownload, LuMenu, LuX } from "react-icons/lu";
import { navLinks, profile, socials } from "@/lib/data";
import { ResumeLink } from "./ResumeLink";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar, SocialLink } from "./ui";

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

// "top" (the hero) has no nav link; observing it clears the highlight when scrolled back up.
const sectionIds = ["top", ...navLinks.map((l) => l.href.slice(1))];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drawer: lock scroll, close on Escape, trap focus, restore focus on close.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const menuButton = menuButtonRef.current;

    const focusables = () => Array.from(drawerRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const els = focusables();
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [open]);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-gold/20 bg-cream-soft/75 shadow-sm shadow-black/[0.03] backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/60"
            : "border-b border-transparent",
        )}
      >
        <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between gap-4 md:h-18">
          <a href="#top" className="group flex items-center gap-2.5" aria-label={`${profile.name}, back to top`}>
            <Avatar
              size={38}
              priority
              className="shadow-lg shadow-sky-500/30 transition-transform duration-300 group-hover:scale-110"
            />
            {/* Wordmark: first name bold, surname in italic gradient. */}
            <span className="hidden font-brand text-[1.2rem] leading-none font-bold tracking-[0.01em] sm:inline">
              {profile.name.split(" ")[0]}{" "}
              <span className="bg-gradient-to-r from-text-1 via-text-2 to-text-3 bg-clip-text pr-[0.08em] font-semibold text-transparent italic">
                {profile.name.split(" ").slice(1).join(" ")}
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            <ul className="flex items-center gap-1">
              {navLinks.map((l) => {
                const isActive = active === l.href.slice(1);
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={isActive ? "true" : undefined}
                      className={clsx(
                        "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-slate-900/5 dark:bg-white/10"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      )}
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <span className="mx-3 h-6 w-px bg-slate-200 dark:bg-white/10" aria-hidden />
            <ThemeToggle />
            <ResumeLink className="btn-primary ml-3 py-2">
              <LuDownload aria-hidden className="size-4" />
              Resume / CV
            </ResumeLink>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              className="grid size-10 place-items-center rounded-full border border-slate-200 dark:border-white/15"
            >
              <LuMenu className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Drawer lives outside <header>: its backdrop-filter would otherwise contain fixed children. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              key="drawer"
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(20rem,85vw)] flex-col border-l border-gold/20 bg-cream-soft p-6 shadow-2xl dark:border-white/10 dark:bg-ink-900 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-display font-semibold">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-full border border-slate-200 dark:border-white/15"
                >
                  <LuX className="size-5" />
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.1 }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "block rounded-xl px-4 py-3 font-display text-2xl font-semibold transition-colors",
                        active === l.href.slice(1)
                          ? "bg-accent/[0.07] text-accent-strong dark:bg-white/5 dark:text-accent-soft"
                          : "hover:bg-accent/[0.07] dark:hover:bg-white/5",
                      )}
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-6">
                <ResumeLink className="btn-primary w-full py-3">
                  <LuDownload aria-hidden className="size-4" />
                  Download Resume / CV
                </ResumeLink>
                <div className="flex justify-center gap-3">
                  {socials.map((s) => (
                    <SocialLink key={s.key} k={s.key} label={s.label} href={s.href} />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
