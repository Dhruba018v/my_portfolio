"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { IntroProvider } from "./Intro";
import { ToastProvider } from "./Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <IntroProvider>
          <ToastProvider>{children}</ToastProvider>
        </IntroProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
