"use client";

import { useEffect, useRef } from "react";

type Vec = { x: number; y: number; z: number };
type RGB = [number, number, number];

/**
 * A slowly rotating 3D "neural network" sphere drawn on a canvas: nodes on a sphere linked to
 * their nearest neighbours, with signals travelling along the links. It tilts toward the
 * pointer. Colours come from the theme's brand tokens, so it follows light/dark mode.
 */
export function NeuralGlobe({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = window.innerWidth < 640 ? 90 : 150;

    // Evenly spread points on a sphere (Fibonacci lattice).
    const nodes: Vec[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      nodes.push({ x: Math.cos(golden * i) * r, y, z: Math.sin(golden * i) * r });
    }

    // Link each node to its 3 nearest neighbours.
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((p, q) => p.d - q.d)
        .slice(0, 3)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) {
            seen.add(key);
            edges.push([i, j]);
          }
        });
    });

    // Theme colours.
    const toRgb = (v: string, fallback: RGB): RGB => {
      const m = v.trim().match(/^#([0-9a-f]{6})$/i);
      if (!m) return fallback;
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    let colors = { a: [37, 99, 235] as RGB, b: [14, 165, 233] as RGB, c: [201, 162, 74] as RGB };
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = {
        a: toRgb(cs.getPropertyValue("--color-brand-1"), colors.a),
        b: toRgb(cs.getPropertyValue("--color-brand-2"), colors.b),
        c: toRgb(cs.getPropertyValue("--color-brand-3"), colors.c),
      };
    };
    readColors();
    const mix = (p: RGB, q: RGB, t: number) => p.map((v, k) => Math.round(v + (q[k] - v) * t)).join(",");

    // Size.
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Pointer tilt (eased).
    let targetX = 0;
    let targetY = 0;
    let tiltX = 0;
    let tiltY = 0;
    const onPointer = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    };

    // Signals travelling along links.
    const pulses: { e: number; t: number; speed: number }[] = [];
    let lastSpawn = 0;

    let spin = 0.6;
    let last = performance.now();
    const projected: { x: number; y: number; z: number; s: number }[] = nodes.map(() => ({ x: 0, y: 0, z: 0, s: 1 }));

    const draw = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (!reduce) spin += dt * 0.00011;
      tiltX += (targetX - tiltX) * 0.05;
      tiltY += (targetY - tiltY) * 0.05;

      const ay = spin + tiltX * 0.9;
      const ax = -0.35 + tiltY * 0.7;
      const [sy, cy, sx, cx] = [Math.sin(ay), Math.cos(ay), Math.sin(ax), Math.cos(ax)];
      const R = Math.min(w, h) * 0.42;
      const cam = 3;

      nodes.forEach((n, i) => {
        // Rotate around Y, then X.
        const x1 = n.x * cy + n.z * sy;
        const z1 = -n.x * sy + n.z * cy;
        const y2 = n.y * cx - z1 * sx;
        const z2 = n.y * sx + z1 * cx;
        const s = cam / (cam - z2);
        const p = projected[i];
        p.x = w / 2 + x1 * R * s;
        p.y = h / 2 + y2 * R * s;
        p.z = z2;
        p.s = s;
      });

      ctx.clearRect(0, 0, w, h);

      // Links: brighter in front, faint behind.
      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const p = projected[i];
        const q = projected[j];
        const depth = ((p.z + q.z) / 2 + 1) / 2;
        ctx.strokeStyle = `rgba(${mix(colors.a, colors.b, depth)},${0.05 + depth * 0.32})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }

      // Nodes.
      for (const p of projected) {
        const depth = (p.z + 1) / 2;
        ctx.fillStyle = `rgba(${mix(colors.a, colors.b, depth)},${0.25 + depth * 0.75})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (0.8 + depth * 1.9) * p.s, 0, Math.PI * 2);
        ctx.fill();
      }

      // Signals.
      if (!reduce && now - lastSpawn > 180 && pulses.length < 16) {
        lastSpawn = now;
        pulses.push({ e: Math.floor(Math.random() * edges.length), t: 0, speed: 0.0007 + Math.random() * 0.0009 });
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pulse = pulses[k];
        pulse.t += dt * pulse.speed;
        if (pulse.t >= 1) {
          pulses.splice(k, 1);
          continue;
        }
        const [i, j] = edges[pulse.e];
        const p = projected[i];
        const q = projected[j];
        const depth = ((p.z + q.z) / 2 + 1) / 2;
        const x = p.x + (q.x - p.x) * pulse.t;
        const y = p.y + (q.y - p.y) * pulse.t;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 7);
        glow.addColorStop(0, `rgba(${colors.c.join(",")},${0.35 + depth * 0.6})`);
        glow.addColorStop(1, `rgba(${colors.c.join(",")},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Only animate while visible on screen and the tab is active.
    let raf = 0;
    let visible = true;
    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readColors();
      if (reduce) draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });

    draw(performance.now());
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
