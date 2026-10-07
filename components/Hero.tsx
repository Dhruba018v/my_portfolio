"use client";

import { motion, type Variants } from "framer-motion";
import { LuArrowRight } from "react-icons/lu";
import { useIntroDone } from "./Intro";
import { NeuralGlobe } from "./NeuralGlobe";
import { profile } from "@/lib/data";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
// Each line swings up into place in 3D.
const item: Variants = {
  hidden: { opacity: 0, y: 36, rotateX: 45, transformPerspective: 900 },
  show: { opacity: 1, y: 0, rotateX: 0, transformPerspective: 900, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const { headline } = profile;
  const introDone = useIntroDone();

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16 phone-landscape:pt-20 phone-landscape:pb-8"
    >
      {/* Background: grid + glows */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand-1/15 blur-[120px] dark:bg-brand-1/20" />
        <div className="absolute top-40 -right-32 h-80 w-80 rounded-full bg-brand-3/20 blur-[100px]" />
        <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-brand-2/10 blur-[100px]" />
        {/* 3D neural-network globe behind the headline */}
        <motion.div
          className="absolute top-1/2 left-1/2 size-[min(110vw,54rem)] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(circle,black_40%,transparent_70%)] phone-landscape:size-[min(90vh,30rem)]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={introDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <NeuralGlobe className="size-full opacity-60 dark:opacity-75" />
        </motion.div>
      </div>

      <div className="container-page flex flex-col items-center text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate={introDone ? "show" : "hidden"}
          className="flex flex-col items-center"
        >
          {profile.available && (
            <motion.div variants={item}>
              <span className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 text-sm font-medium">
                <span className="relative flex size-2.5" aria-hidden>
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                </span>
                {profile.availabilityText}
              </span>
            </motion.div>
          )}

          <motion.h1
            id="hero-title"
            variants={item}
            className="mt-6 max-w-4xl font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-[4rem] 2xl:max-w-5xl 2xl:text-[4.75rem] short:mt-5 short:text-[3.25rem] phone-landscape:mt-4 phone-landscape:max-w-2xl phone-landscape:text-3xl"
          >
            {headline.before} <span className="text-gradient">{headline.skillOne}</span> {headline.middle}{" "}
            <span className="text-gradient">{headline.skillTwo}</span>
            {headline.after}
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center justify-center gap-4 short:mt-7 phone-landscape:mt-5"
          >
            <a href="#research" className="btn-primary group px-6 py-3 text-base">
              View My Research
              <LuArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#contact" className="btn-outline px-6 py-3 text-base">
              Let&apos;s Talk
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
