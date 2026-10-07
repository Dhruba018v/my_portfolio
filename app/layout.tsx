import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Instrument_Serif, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/Providers";
import { profile } from "@/lib/data";
import "./globals.css";

// Font roles: body/UI (Geist), headings (Bricolage Grotesque),
// highlighted words (Instrument Serif italic), labels & dates (JetBrains Mono).
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
// Name wordmark in the navbar.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.subheadline,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.subheadline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfbf6" },
    { media: "(prefers-color-scheme: dark)", color: "#06110f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${bricolage.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
      <head>
        <link rel="preload" as="image" href={profile.introImage} type="image/webp" />
        {/* Always start at the top on load/reload: stop the browser restoring the old scroll
            position, and drop any "#section" left in the address bar by nav links. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if("scrollRestoration" in history)history.scrollRestoration="manual";if(location.hash)history.replaceState(null,"",location.pathname+location.search);window.scrollTo(0,0)}catch(e){}`,
          }}
        />
      </head>
      <body>
        {/* Without JavaScript the intro can't animate, so don't let it cover the page. */}
        <noscript>
          <style>{`#intro{display:none!important}`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
