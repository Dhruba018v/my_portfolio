"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Render dark state on the server (default theme) to avoid layout shift.
  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-slate-300 bg-slate-100 p-1 transition-colors dark:border-white/15 dark:bg-white/10"
    >
      <LuSun aria-hidden className="absolute left-2 size-3.5 text-amber-500" />
      <LuMoon aria-hidden className="absolute right-2 size-3.5 text-slate-400" />
      <motion.span
        aria-hidden
        className="relative z-10 grid size-6 place-items-center rounded-full bg-white shadow-md dark:bg-accent"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        {isDark ? <LuMoon className="size-3.5 text-white" /> : <LuSun className="size-3.5 text-amber-500" />}
      </motion.span>
    </button>
  );
}
