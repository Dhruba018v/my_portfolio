"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuChevronLeft, LuChevronRight, LuExpand, LuImagePlus, LuImages, LuUndo2, LuX } from "react-icons/lu";
import { gallery, type GalleryImage } from "@/lib/data";
import { ProfileCard } from "./ProfileCard";

const faceStyle = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } as const;

/** Profile card that flips over to reveal a photo gallery. */
export function ProfileFlipCard() {
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const moveFocus = useRef(false);

  // Keyboard users: move focus to the face that just became visible.
  // (Mouse/touch clicks have event.detail > 0, so they don't get a focus ring.)
  const flip = (to: boolean) => (e: React.MouseEvent) => {
    moveFocus.current = e.detail === 0;
    setFlipped(to);
  };
  useEffect(() => {
    if (!moveFocus.current) return;
    const t = window.setTimeout(() => (flipped ? backRef.current : openRef.current)?.focus(), 350);
    return () => window.clearTimeout(t);
  }, [flipped]);

  const count = gallery.length;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);

  // The profile side is short; when flipped, grow the card so the photo gets a 4:3 frame.
  const frontRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = frontRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Card padding (40) + header (~36) + gaps (28) + thumbnails (~52).
  const galleryHeight = Math.round((size.w - 40) * 0.75 + 156);
  const height = !size.h ? "auto" : flipped && count > 0 ? Math.max(size.h, galleryHeight) : size.h;

  return (
    <div className="[perspective:1400px]">
      <motion.div
        className="relative [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0, height }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ---------- Front: profile ---------- */}
        <div ref={frontRef} className="relative" style={faceStyle} inert={flipped}>
          <ProfileCard />
          <GalleryButton ref={openRef} onClick={flip(true)} />
        </div>

        {/* ---------- Back: gallery ---------- */}
        <div
          className="glass absolute inset-0 flex flex-col overflow-hidden rounded-3xl p-5 shadow-2xl shadow-brand-1/10 dark:shadow-black/40"
          style={{ ...faceStyle, transform: "rotateY(180deg)" }}
          inert={!flipped}
          aria-label="Photo gallery"
          role="region"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-gradient-to-br from-brand-2/30 to-brand-1/10 blur-2xl"
          />

          <div className="relative flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-display text-lg font-semibold">
              <LuImages aria-hidden className="text-accent-adaptive size-5" />
              Gallery
              {count > 0 && (
                <span className="text-muted font-sans text-xs font-normal tabular-nums">
                  {index + 1} / {count}
                </span>
              )}
            </p>
            <button
              ref={backRef}
              type="button"
              onClick={flip(false)}
              className="btn-outline px-3 py-1.5 text-xs"
              aria-label="Flip back to profile"
            >
              <LuUndo2 aria-hidden className="size-3.5" /> Back
            </button>
          </div>

          {count === 0 ? (
            <div className="relative mt-4 flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold/30 p-4 text-center dark:border-white/15">
              <span className="grid size-12 place-items-center rounded-full bg-accent/10 text-accent-strong dark:text-accent-soft">
                <LuImagePlus aria-hidden className="size-6" />
              </span>
              <p className="mt-3 font-semibold">Photos coming soon</p>
              <p className="text-muted mt-1 text-sm">Moments from my journey will appear here.</p>
            </div>
          ) : (
            <>
              {/* Main photo */}
              <div className="group/photo relative mt-4 min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => setLightbox(index)}
                    className="absolute inset-0 cursor-zoom-in"
                    aria-label={`Open photo ${index + 1} full screen: ${gallery[index].alt}`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Whole photo (nothing cropped, so every face shows), over a blurred copy
                        that fills the empty space around it. */}
                    <Image
                      src={gallery[index].src}
                      alt=""
                      aria-hidden
                      fill
                      sizes="64px"
                      className="scale-125 object-cover opacity-70 blur-2xl"
                    />
                    <Image
                      src={gallery[index].src}
                      alt={gallery[index].alt}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 520px, 92vw"
                      className="object-contain drop-shadow-xl"
                    />
                  </motion.button>
                </AnimatePresence>

                {gallery[index].caption && (
                  <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2 text-xs text-white">
                    {gallery[index].caption}
                  </p>
                )}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/45 text-white opacity-0 transition-opacity group-hover/photo:opacity-100"
                >
                  <LuExpand className="size-3.5" />
                </span>

                {count > 1 && (
                  <>
                    <NavArrow side="left" onClick={() => go(-1)} />
                    <NavArrow side="right" onClick={() => go(1)} />
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {count > 1 && (
                <div className="relative mt-3 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, i) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show photo ${i + 1}`}
                      aria-current={i === index}
                      className={clsx(
                        "relative size-12 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                        i === index ? "ring-accent" : "opacity-60 ring-transparent hover:opacity-100",
                      )}
                    >
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                        style={{ objectPosition: img.focus ?? "50% 50%" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      <Lightbox images={gallery} index={lightbox} onChange={setLightbox} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function GalleryButton({
  ref,
  onClick,
}: {
  ref: React.Ref<HTMLButtonElement>;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label="Open photo gallery"
      className="group absolute top-5 right-5 z-10 grid size-11 place-items-center rounded-full transition-transform duration-300 hover:scale-110 active:scale-95"
    >
      {/* Spinning gradient ring */}
      <span
        aria-hidden
        className="absolute inset-0 animate-[spin_5s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,var(--color-brand-1),var(--color-brand-2),var(--color-brand-3),var(--color-brand-1))] shadow-lg shadow-brand-1/30"
      />
      <span aria-hidden className="absolute inset-[2.5px] rounded-full bg-cream-soft dark:bg-ink-900" />
      <LuImages
        aria-hidden
        className="relative size-5 text-accent-strong transition-transform duration-300 group-hover:-rotate-12 dark:text-accent-soft"
      />
      {/* Tooltip */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-full mr-2 hidden -translate-y-1/2 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
      >
        Open gallery
      </span>
    </button>
  );
}

function NavArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? LuChevronLeft : LuChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={clsx(
        "absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70",
        side === "left" ? "left-2" : "right-2",
      )}
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tap/click to zoom into the spot you touched; scroll, swipe or move */
/* the mouse to look around. Tap again to zoom back out.              */
/* ------------------------------------------------------------------ */

const ZOOM = 2.5;

function ZoomableImage({ image }: { image: GalleryImage }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLButtonElement>(null);
  const [zoomed, setZoomed] = useState<{ w: number; h: number } | null>(null);
  const [ratio, setRatio] = useState(0); // photo width / height, known once loaded
  const target = useRef({ x: 0.5, y: 0.5 });

  // Size and position of the photo inside the frame (object-contain).
  function shown(box: HTMLDivElement) {
    const r = box.getBoundingClientRect();
    const ar = ratio || r.width / r.height;
    const w = Math.min(r.width, r.height * ar);
    const h = w / ar;
    return { left: r.left + (r.width - w) / 2, top: r.top + (r.height - h) / 2, w, h };
  }

  // After zooming in, scroll so the tapped spot sits in the middle. The browser can take a
  // few frames to report the bigger scroll area, so retry until the scroll sticks.
  useEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner || !zoomed) return;
    let raf = 0;
    let tries = 0;
    const apply = () => {
      // Zoomed in, the photo always overflows the frame on at least one side.
      const ready = box.scrollWidth > box.clientWidth || box.scrollHeight > box.clientHeight;
      if (!ready) {
        if (++tries < 30) raf = requestAnimationFrame(apply);
        return;
      }
      box.scrollLeft = inner.offsetLeft + target.current.x * zoomed.w - box.clientWidth / 2;
      box.scrollTop = inner.offsetTop + target.current.y * zoomed.h - box.clientHeight / 2;
    };
    raf = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(raf);
  }, [zoomed]);

  function toggle(e: React.MouseEvent) {
    const box = boxRef.current;
    if (!box) return;
    if (zoomed) return setZoomed(null);
    const s = shown(box);
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    // Keyboard "clicks" have no position: zoom into the centre.
    target.current =
      e.detail === 0 ? { x: 0.5, y: 0.5 } : { x: clamp((e.clientX - s.left) / s.w), y: clamp((e.clientY - s.top) / s.h) };
    setZoomed({ w: s.w * ZOOM, h: s.h * ZOOM });
  }

  // With a mouse, the zoomed photo follows the cursor (touch users swipe instead).
  function follow(e: React.PointerEvent) {
    const box = boxRef.current;
    if (!box || !zoomed || e.pointerType !== "mouse") return;
    const r = box.getBoundingClientRect();
    box.scrollLeft = ((e.clientX - r.left) / r.width) * (box.scrollWidth - box.clientWidth);
    box.scrollTop = ((e.clientY - r.top) / r.height) * (box.scrollHeight - box.clientHeight);
  }

  return (
    <div
      ref={boxRef}
      onPointerMove={follow}
      className={clsx(
        // Grid + m-auto centres the zoomed photo when it's smaller than the frame on one side,
        // without hiding any part of it when it's larger.
        "absolute inset-0 grid [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        zoomed ? "overflow-auto" : "overflow-hidden",
      )}
    >
      <button
        ref={innerRef}
        type="button"
        onClick={toggle}
        aria-label={zoomed ? "Zoom out" : "Zoom in"}
        aria-pressed={!!zoomed}
        className={clsx("relative m-auto block", zoomed ? "cursor-zoom-out" : "size-full cursor-zoom-in")}
        style={zoomed ? { width: zoomed.w, height: zoomed.h } : undefined}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          quality={90}
          sizes={zoomed ? `${ZOOM * 100}vw` : "100vw"}
          className="object-contain"
          onLoad={(e) => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Full-screen viewer (portalled so card transforms don't trap it)    */
/* ------------------------------------------------------------------ */

function Lightbox({
  images,
  index,
  onChange,
}: {
  images: GalleryImage[];
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const open = index !== null;
  const count = images.length;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") onChange(((index ?? 0) + 1) % count);
      if (e.key === "ArrowLeft") onChange(((index ?? 0) - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, count, onChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null)}
        >
          <button
            type="button"
            autoFocus
            onClick={() => onChange(null)}
            aria-label="Close photo viewer"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <LuX className="size-5" />
          </button>

          <motion.div
            key={index}
            className="relative h-[calc(100svh-9rem)] w-full max-w-6xl sm:h-[80svh]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ZoomableImage image={images[index]} />
          </motion.div>

          <div className="mt-4 text-center text-sm text-white/80" onClick={(e) => e.stopPropagation()}>
            {images[index].caption && <p className="text-white">{images[index].caption}</p>}
            <p className="mt-1 tabular-nums">
              {index + 1} / {count}
              <span className="ml-2 text-white/50">· Tap photo to zoom</span>
            </p>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange((index - 1 + count) % count);
                }}
                aria-label="Previous photo"
                className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              >
                <LuChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange((index + 1) % count);
                }}
                aria-label="Next photo"
                className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              >
                <LuChevronRight className="size-6" />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
