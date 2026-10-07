"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiInstagram, SiX } from "react-icons/si";
import Image from "next/image";
import { profile, type SocialKey } from "@/lib/data";

/** Fade + swing up in 3D when scrolled into view. */
export function Reveal({
  delay = 0,
  y = 24,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, rotateX: 14, transformPerspective: 1000 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, transformPerspective: 1000 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const tiltSpring = { stiffness: 220, damping: 22, mass: 0.6 };

/**
 * Card that tilts toward the mouse in 3D, with a soft light sheen following the cursor.
 * Touch and reduced-motion users get a normal, still card. The card needs `relative`.
 */
export function TiltCard({
  as = "div",
  max = 7,
  children,
  style,
  onPointerMove,
  onPointerLeave,
  ...rest
}: HTMLMotionProps<"div"> & { as?: "div" | "li" | "article"; max?: number }) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);
  const scale = useSpring(1, tiltSpring);
  const sheen = useSpring(0, { stiffness: 160, damping: 26 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const sheenBg = useMotionTemplate`radial-gradient(30rem circle at ${gx}% ${gy}%, var(--tilt-sheen), transparent 45%)`;
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      {...rest}
      style={{ ...style, rotateX, rotateY, scale, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        rotateY.set((px - 0.5) * 2 * max);
        rotateX.set(-(py - 0.5) * 2 * max);
        scale.set(1.02);
        gx.set(px * 100);
        gy.set(py * 100);
        sheen.set(1);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        rotateX.set(0);
        rotateY.set(0);
        scale.set(1);
        sheen.set(0);
      }}
    >
      {children as React.ReactNode}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: sheenBg, opacity: sheen }}
      />
    </Comp>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}) {
  return (
    <Reveal className="mb-12 max-w-2xl md:mb-16">
      <p className="text-accent-adaptive mb-3 font-mono text-xs font-semibold tracking-[0.2em] uppercase">{eyebrow}</p>
      <h2 id={id} className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && <p className="text-muted mt-4 text-lg text-pretty">{description}</p>}
    </Reveal>
  );
}

/** Circular profile picture / logo. */
export function Avatar({ size, className = "", priority }: { size: number; className?: string; priority?: boolean }) {
  return (
    <Image
      src={profile.avatar}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={`shrink-0 rounded-full object-cover ring-2 ring-sky-400/40 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

const socialIcons: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  github: SiGithub,
  linkedin: FaLinkedinIn,
  x: SiX,
  instagram: SiInstagram,
};

const socialHover: Record<SocialKey, string> = {
  github: "hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900",
  linkedin: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
  x: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
  instagram:
    "hover:border-transparent hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white",
};

export function SocialLink({
  k,
  label,
  href,
  size = "md",
}: {
  k: SocialKey;
  label: string;
  href: string;
  size?: "md" | "lg";
}) {
  const Icon = socialIcons[k];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className={`group inline-flex items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:text-slate-300 ${socialHover[k]} ${
        size === "lg" ? "size-12" : "size-10"
      }`}
    >
      <Icon
        className={`${size === "lg" ? "size-5" : "size-4"} transition-transform duration-200 group-hover:scale-110`}
      />
    </a>
  );
}
