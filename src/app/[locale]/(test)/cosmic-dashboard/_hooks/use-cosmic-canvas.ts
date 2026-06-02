"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  depth: number;
}

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

export interface CosmicCanvas {
  starfieldRef: React.RefObject<HTMLCanvasElement | null>;
  dustRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useCosmicCanvas(): CosmicCanvas {
  const starfieldRef = useRef<HTMLCanvasElement | null>(null);
  const dustRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; tx: number; ty: number }>({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
  });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const starCanvas = starfieldRef.current;
    const dustCanvas = dustRef.current;
    if (!starCanvas || !dustCanvas) return;
    const starCtx = starCanvas.getContext("2d");
    const dustCtx = dustCanvas.getContext("2d");
    if (!starCtx || !dustCtx) return;

    let stars: Star[] = [];
    let dust: Dust[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seedRand = (() => {
      let s = 0x9e3779b9;
      return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
      };
    })();

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      [starCanvas, dustCanvas].forEach((c) => {
        c.width = Math.floor(width * dpr);
        c.height = Math.floor(height * dpr);
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      });
      starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dustCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = [];
      for (let i = 0; i < 180; i++) {
        stars.push({
          x: seedRand() * width,
          y: seedRand() * height,
          r: 0.3 + seedRand() * 0.5,
          baseAlpha: 0.3 + seedRand() * 0.5,
          twinkleSpeed: 0.3 + seedRand() * 0.7,
          twinklePhase: seedRand() * Math.PI * 2,
          depth: 0,
        });
      }
      for (let i = 0; i < 40; i++) {
        stars.push({
          x: seedRand() * width,
          y: seedRand() * height,
          r: 0.8 + seedRand() * 0.8,
          baseAlpha: 0.4 + seedRand() * 0.5,
          twinkleSpeed: 0.8 + seedRand() * 1.2,
          twinklePhase: seedRand() * Math.PI * 2,
          depth: 1,
        });
      }

      dust = [];
      for (let i = 0; i < 40; i++) {
        dust.push({
          x: seedRand() * width,
          y: seedRand() * height,
          vx: (seedRand() - 0.5) * 0.2,
          vy: (seedRand() - 0.5) * 0.2,
          r: 0.5 + seedRand() * 0.7,
          alpha: 0.1 + seedRand() * 0.3,
        });
      }
    };

    const drawStarfield = (time: number) => {
      starCtx.clearRect(0, 0, width, height);
      const m = mouseRef.current;
      for (const s of stars) {
        const parallax = s.depth === 1 ? 12 : 4;
        const ox = ((m.x - 0.5) * -parallax) / 0.5;
        const oy = ((m.y - 0.5) * -parallax) / 0.5;
        const twinkle = reduceMotion
          ? 1
          : 0.5 + 0.5 * Math.sin(time * 0.001 * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.baseAlpha * twinkle;
        starCtx.beginPath();
        starCtx.arc(s.x + ox, s.y + oy, s.r, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(${s.depth === 1 ? "224, 231, 255" : "200, 215, 255"}, ${alpha})`;
        starCtx.fill();
      }
    };

    const drawDust = () => {
      dustCtx.clearRect(0, 0, width, height);
      for (const d of dust) {
        if (!reduceMotion) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0) d.x = width;
          if (d.x > width) d.x = 0;
          if (d.y < 0) d.y = height;
          if (d.y > height) d.y = 0;
        }
        dustCtx.beginPath();
        dustCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        dustCtx.fillStyle = `rgba(139, 92, 246, ${d.alpha})`;
        dustCtx.fill();
      }
    };

    const tick = (time: number) => {
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.08;
      m.y += (m.ty - m.y) * 0.08;
      drawStarfield(time);
      drawDust();
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX / window.innerWidth;
      mouseRef.current.ty = e.clientY / window.innerHeight;
    };

    const onResize = () => {
      let timeout: number | null = null;
      if (timeout) window.clearTimeout(timeout);
      timeout = window.setTimeout(() => init(), 100);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    init();
    mouseRef.current.tx = 0.5;
    mouseRef.current.ty = 0.5;
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { starfieldRef, dustRef };
}
