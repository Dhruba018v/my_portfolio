"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Intro state shared with the page (hero waits for the intro to end)  */
/* ------------------------------------------------------------------ */

const IntroContext = createContext<{ done: boolean; finish: () => void }>({ done: true, finish: () => {} });
export const useIntroDone = () => useContext(IntroContext).done;

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);
  return <IntroContext.Provider value={{ done, finish }}>{children}</IntroContext.Provider>;
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const IMAGE = profile.introImage;
const ASPECT = 1312 / 1199; // width / height of the intro image
const COLS = 5;
const ROWS = 5;
const KNOB = 0.2; // knob height as a fraction of the edge length

/* ------------------------------------------------------------------ */
/* Jigsaw geometry                                                     */
/* ------------------------------------------------------------------ */

/** One edge from A to B. `n` is the absolute direction the knob bulges (or null for a flat edge). */
function edge(ax: number, ay: number, bx: number, by: number, n: [number, number] | null) {
  if (!n) return ` L ${bx.toFixed(1)} ${by.toFixed(1)}`;
  const len = Math.hypot(bx - ax, by - ay);
  const dx = (bx - ax) / len;
  const dy = (by - ay) / len;
  const p = (t: number, h: number) =>
    `${(ax + dx * t * len + n[0] * h * len).toFixed(1)} ${(ay + dy * t * len + n[1] * h * len).toFixed(1)}`;
  const k = KNOB;
  // Symmetric knob, so pieces sharing an edge match whichever way it is drawn.
  return (
    ` L ${p(0.37, 0)}` +
    ` C ${p(0.43, 0)} ${p(0.31, k)} ${p(0.5, k)}` +
    ` C ${p(0.69, k)} ${p(0.57, 0)} ${p(0.63, 0)}` +
    ` L ${bx.toFixed(1)} ${by.toFixed(1)}`
  );
}

type Piece = {
  id: number;
  left: number;
  top: number;
  size: [number, number];
  bgPos: string;
  path: string;
  from: { x: number; y: number; rotate: number };
  delay: number;
};

function buildPieces(w: number, h: number, vw: number, vh: number): Piece[] {
  const cw = w / COLS;
  const ch = h / ROWS;
  const pad = KNOB * Math.max(cw, ch) + 2;
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const sign = () => (Math.random() < 0.5 ? -1 : 1);

  // Knob direction for every internal edge, shared by both neighbours.
  const hEdge = Array.from({ length: ROWS + 1 }, () => Array.from({ length: COLS }, sign)); // top of row r
  const vEdge = Array.from({ length: ROWS }, () => Array.from({ length: COLS + 1 }, sign)); // left of col c

  // Random fly-in order.
  const order = Array.from({ length: ROWS * COLS }, (_, i) => i).sort(() => Math.random() - 0.5);

  const pieces: Piece[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x0 = pad;
      const y0 = pad;
      const x1 = pad + cw;
      const y1 = pad + ch;
      const path =
        `M ${x0.toFixed(1)} ${y0.toFixed(1)}` +
        edge(x0, y0, x1, y0, r === 0 ? null : [0, hEdge[r][c]]) +
        edge(x1, y0, x1, y1, c === COLS - 1 ? null : [vEdge[r][c + 1], 0]) +
        edge(x1, y1, x0, y1, r === ROWS - 1 ? null : [0, hEdge[r + 1][c]]) +
        edge(x0, y1, x0, y0, c === 0 ? null : [vEdge[r][c], 0]) +
        " Z";

      const left = c * cw - pad;
      const top = r * ch - pad;
      // Scatter: somewhere around the screen, outside the middle where possible.
      const angle = rand(0, Math.PI * 2);
      const radius = rand(0.35, 0.6);
      const id = r * COLS + c;
      pieces.push({
        id,
        left,
        top,
        size: [cw + pad * 2, ch + pad * 2],
        bgPos: `${-left}px ${-top}px`,
        path,
        from: {
          x: Math.cos(angle) * vw * radius - (left + pad + cw / 2 - w / 2),
          y: Math.sin(angle) * vh * radius - (top + pad + ch / 2 - h / 2),
          rotate: rand(-90, 90),
        },
        delay: 0.25 + (order.indexOf(id) / (ROWS * COLS)) * 1.6,
      });
    }
  }
  return pieces;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type Phase = "loading" | "assembling" | "assembled" | "leaving";

export function PuzzleIntro() {
  const { finish } = useContext(IntroContext);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>("loading");
  const [board, setBoard] = useState<{ w: number; h: number; vw: number; vh: number } | null>(null);
  const placed = useRef(0);

  const close = useCallback(() => {
    setPhase("leaving");
    setVisible(false);
    finish();
  }, [finish]);

  // Size the board to the screen, preload the image, then start.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      close();
      return;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(vw * 0.86, (vh * 0.62) * ASPECT, 620);
    setBoard({ w, h: w / ASPECT, vw, vh });

    let cancelled = false;
    const img = new Image();
    img.src = IMAGE;
    const start = () => !cancelled && setPhase("assembling");
    img.decode().then(start, start);
    return () => {
      cancelled = true;
    };
  }, [close]);

  // Lock scrolling and allow Esc to skip while the intro is on screen.
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, close]);

  // Once assembled, hold briefly then reveal the site. Safety net if animations stall.
  useEffect(() => {
    if (phase === "assembled") {
      const t = window.setTimeout(close, 1500);
      return () => window.clearTimeout(t);
    }
    if (phase === "assembling") {
      const t = window.setTimeout(() => setPhase((p) => (p === "assembling" ? "assembled" : p)), 6000);
      return () => window.clearTimeout(t);
    }
  }, [phase, close]);

  const pieces = useMemo(() => (board ? buildPieces(board.w, board.h, board.vw, board.vh) : []), [board]);

  const onPiecePlaced = () => {
    placed.current += 1;
    if (placed.current === pieces.length) setPhase("assembled");
  };

  const assembled = phase === "assembled" || phase === "leaving";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="intro"
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-label={`${profile.name} — intro animation`}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-white text-slate-900"
          exit={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Soft edge glow that matches the photo's palette */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 size-[32rem] rounded-full bg-blue-300/30 blur-[120px]" />
            <div className="absolute -right-40 -bottom-40 size-[32rem] rounded-full bg-amber-200/40 blur-[120px]" />
          </div>

          {board && (
            <div className="relative" style={{ width: board.w, height: board.h }}>
              {/* Seamless full image fades in under the pieces once they've landed. */}
              <motion.img
                src={IMAGE}
                alt=""
                className="absolute inset-0 size-full select-none"
                style={{
                  // Feather the photo's white edges into the background.
                  maskImage:
                    "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)",
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }}
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: assembled ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />

              {phase !== "loading" &&
                pieces.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute"
                    style={{
                      left: p.left,
                      top: p.top,
                      width: p.size[0],
                      height: p.size[1],
                      filter: assembled ? "none" : "drop-shadow(0 6px 10px rgba(49, 46, 129, 0.28))",
                    }}
                    initial={{ ...p.from, opacity: 0, scale: 0.85 }}
                    animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: assembled ? 0 : 1 }}
                    transition={{
                      default: { type: "spring", stiffness: 60, damping: 13, mass: 0.9, delay: p.delay },
                      opacity: assembled ? { duration: 0.4, delay: 0.15 } : { duration: 0.3, delay: p.delay },
                    }}
                    onAnimationComplete={() => !assembled && onPiecePlaced()}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: `path('${p.path}')`,
                        backgroundImage: `url(${IMAGE})`,
                        backgroundSize: `${board.w}px ${board.h}px`,
                        backgroundPosition: p.bgPos,
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "#fff",
                      }}
                    />
                    <svg aria-hidden className="absolute inset-0 size-full overflow-visible">
                      <path d={p.path} fill="none" stroke="rgba(99, 102, 241, 0.55)" strokeWidth="1.2" />
                    </svg>
                  </motion.div>
                ))}
            </div>
          )}

          <div className="relative mt-6 h-16 text-center">
            <AnimatePresence>
              {assembled && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{profile.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{profile.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={close}
            className="absolute right-5 bottom-5 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur transition hover:border-slate-900 hover:text-slate-900"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
