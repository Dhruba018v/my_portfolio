import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { PuzzleIntro } from "@/components/Intro";
import { Navbar } from "@/components/Navbar";
import { Research } from "@/components/Research";
import { TechStack } from "@/components/TechStack";

export default function Home() {
  return (
    <>
      <PuzzleIntro />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white dark:focus:text-ink-950"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Education />
        <Research />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
