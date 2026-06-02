"use client";

import { useEffect, useRef, useState } from "react";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface TickingMockOptions {
  initial: number;
  min: number;
  max: number;
  intervalMs?: number;
  step?: number;
  seed?: number;
}

export function useTickingMock({
  initial,
  min,
  max,
  intervalMs = 2500,
  step = 0.08,
  seed = 1,
}: TickingMockOptions): number {
  const [value, setValue] = useState<number>(initial);
  const randRef = useRef<() => number>(mulberry32(seed));
  const currentRef = useRef<number>(initial);

  useEffect(() => {
    const rand = randRef.current;
    const id = setInterval(() => {
      const range = max - min;
      const delta = (rand() - 0.5) * range * step;
      let next = currentRef.current + delta;
      if (next > max) next = max - (next - max) * 0.5;
      if (next < min) next = min + (min - next) * 0.5;
      next = Math.max(min, Math.min(max, next));
      currentRef.current = next;
      setValue(next);
    }, intervalMs);
    return () => clearInterval(id);
  }, [min, max, intervalMs, step]);

  return value;
}
