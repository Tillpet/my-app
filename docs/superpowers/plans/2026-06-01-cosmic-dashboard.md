# Cosmic Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page "Mission Control" dashboard at `src/app/[locale]/(test)/cosmic-dashboard/` with a futuristic cosmic theme (deep violet + neon cyan, glassmorphism, animated starfield, real-time mock data).

**Architecture:** Server-component shell renders a client root. Client root mounts a fixed-position particle background (canvas starfield + canvas dust + CSS orbs + click ripples), then a layout of glass-card widgets (KPI cards, live chart, radar, server list, activity feed, signal bars) driven by ticking mock-data hooks. All glow/motion respects `prefers-reduced-motion`.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript 5, TailwindCSS 4, shadcn/ui (new-york, neutral), lucide-react, next/font (Space Grotesk + existing Geist), HTML5 Canvas 2D, CSS animations. No new dependencies.

**Verification strategy:** This project has no test framework. Per the spec's goals (pure visual showcase), verification is:
- `pnpm lint` — type/lint safety
- `pnpm build` — production build
- `pnpm dev` + manual visual QA at desktop / tablet / mobile widths, with reduced-motion enabled in OS settings
- TDD is not used here because the work is mostly visual; the few logic-bearing pieces (RNG ticker) are simple enough that lint + manual smoke are sufficient. If a test framework is later added, the hooks are isolated and easily testable.

**Reference spec:** `docs/superpowers/specs/2026-06-01-cosmic-dashboard-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `src/app/globals.css` (modify) | Add `[data-theme="cosmic"]` block + `--color-cosmic-*` Tailwind tokens |
| `src/app/[locale]/(test)/cosmic-dashboard/layout.tsx` | Route layout: load Space Grotesk, set `data-theme="cosmic"` on wrapper |
| `src/app/[locale]/(test)/cosmic-dashboard/page.tsx` | Server component, renders `<CosmicDashboardClient />` |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx` | Client root composing all widgets in the grid |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-background.tsx` | Starfield + dust canvases + 3 ambient orbs |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-ripple.tsx` | Click ripple overlay (window-level click listener) |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/glass-card.tsx` | Glassmorphism card primitive |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/glass-button.tsx` | Glassmorphism button primitive (3 variants) |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/sidebar.tsx` | Sidebar with nav, logo, user card (desktop/tablet/mobile via Sheet) |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/top-bar.tsx` | Top bar: hamburger, breadcrumb, search, bell, avatar |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/kpi-card.tsx` | Single KPI card with sparkline + trend pill |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/live-chart.tsx` | Canvas line chart, 60 points, sliding |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/radar-scanner.tsx` | Canvas radar with rotating sweep + blips |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/server-list.tsx` | 6 server rows + filter chips |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/activity-feed.tsx` | 8-entry rolling activity feed |
| `src/app/[locale]/(test)/cosmic-dashboard/_components/signal-bars.tsx` | 8 endpoint rows with 5-segment bars |
| `src/app/[locale]/(test)/cosmic-dashboard/_hooks/use-cosmic-canvas.ts` | Starfield + dust rAF renderer |
| `src/app/[locale]/(test)/cosmic-dashboard/_hooks/use-ticking-mock.ts` | Random-walk numeric ticker with seeded RNG |
| `src/app/[locale]/(test)/cosmic-dashboard/_lib/mock-data.ts` | Static seed data: servers, endpoints, activity, KPIs |
| `src/app/[locale]/(test)/cosmic-dashboard/cosmic-dashboard.css` | Keyframes, glow utilities, scrollbar styling |

---

## Task 1: Theme tokens & cosmic CSS

**Files:**
- Modify: `src/app/globals.css` (append `[data-theme="cosmic"]` block + Tailwind tokens in `@theme inline`)
- Create: `src/app/[locale]/(test)/cosmic-dashboard/cosmic-dashboard.css`

- [ ] **Step 1: Append the cosmic theme block to `globals.css`**

Open `src/app/globals.css`. In the `@layer theme` block, just before the closing `}`, append (after the existing `[data-theme="plant"].dark` block ends, around line 337):

```css
  /* Cosmic 主题 ──────────────────────────────────────── */
  [data-theme="cosmic"] {
    --cosmic-bg: #030014;
    --cosmic-bg-raised: #0a0420;
    --cosmic-glass: rgba(255, 255, 255, 0.04);
    --cosmic-glass-strong: rgba(255, 255, 255, 0.08);
    --cosmic-cyan: #22d3ee;
    --cosmic-cyan-bright: #00f0ff;
    --cosmic-violet: #8b5cf6;
    --cosmic-violet-bright: #a855f7;
    --cosmic-magenta: #ff2dd1;
    --cosmic-text: #e0e7ff;
    --cosmic-text-muted: #7a8bbf;
    --cosmic-border: rgba(34, 211, 238, 0.15);
    --cosmic-border-glow: rgba(139, 92, 246, 0.2);
    --cosmic-success: #10ffb0;
    --cosmic-warning: #ffb13b;
    --cosmic-danger: #ff2dd1;
  }
```

Then in the `@theme inline` block, after the existing `--color-plant-*` tokens (around line 574), append:

```css
  /* Cosmic theme utilities */
  --color-cosmic-bg: var(--cosmic-bg);
  --color-cosmic-bg-raised: var(--cosmic-bg-raised);
  --color-cosmic-glass: var(--cosmic-glass);
  --color-cosmic-glass-strong: var(--cosmic-glass-strong);
  --color-cosmic-cyan: var(--cosmic-cyan);
  --color-cosmic-cyan-bright: var(--cosmic-cyan-bright);
  --color-cosmic-violet: var(--cosmic-violet);
  --color-cosmic-violet-bright: var(--cosmic-violet-bright);
  --color-cosmic-magenta: var(--cosmic-magenta);
  --color-cosmic-text: var(--cosmic-text);
  --color-cosmic-text-muted: var(--cosmic-text-muted);
  --color-cosmic-success: var(--cosmic-success);
  --color-cosmic-warning: var(--cosmic-warning);
  --color-cosmic-danger: var(--cosmic-danger);

  /* Cosmic fonts */
  --font-cosmic-display: var(--font-cosmic-display);
```

- [ ] **Step 2: Create `cosmic-dashboard.css`**

Create `src/app/[locale]/(test)/cosmic-dashboard/cosmic-dashboard.css` with the following content:

```css
/* Cosmic Dashboard styles */

@keyframes cosmic-float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(60px, -40px) scale(1.15);
  }
}

@keyframes cosmic-ripple {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.6;
  }
  to {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

@keyframes cosmic-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes cosmic-slide-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cosmic-glass {
  background: var(--cosmic-glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--cosmic-border);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 0 0 1px var(--cosmic-border-glow);
}

.cosmic-glow-cyan {
  box-shadow:
    0 0 24px rgba(34, 211, 238, 0.25),
    inset 0 0 12px rgba(34, 211, 238, 0.08);
}

.cosmic-glow-violet {
  box-shadow:
    0 0 24px rgba(139, 92, 246, 0.25),
    inset 0 0 12px rgba(139, 92, 246, 0.08);
}

.cosmic-focus-ring:focus-visible {
  outline: 2px solid var(--cosmic-cyan-bright);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.3);
}

.cosmic-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.cosmic-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.cosmic-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.4);
  border-radius: 10px;
}
.cosmic-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 92, 246, 0.4) transparent;
}

@media (prefers-reduced-motion: reduce) {
  .cosmic-float-orb,
  .cosmic-ripple,
  .cosmic-pulse,
  .cosmic-slide-in {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Verify lint and build**

Run: `pnpm lint`
Expected: PASS (no errors related to CSS — CSS is not linted, but any syntax issues in TS will show)

Run: `pnpm build`
Expected: PASS (no errors)

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/[locale]/\(test\)/cosmic-dashboard/cosmic-dashboard.css
git commit -m "feat(cosmic-dashboard): add cosmic theme tokens and base styles"
```

---

## Task 2: Route layout, fonts, and empty page

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/layout.tsx`
- Create: `src/app/[locale]/(test)/cosmic-dashboard/page.tsx`
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx`

- [ ] **Step 1: Create `layout.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./cosmic-dashboard.css";

const cosmicDisplay = Space_Grotesk({
  variable: "--font-cosmic-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cosmic Mission Control",
  description: "Futuristic mission control dashboard with a celestial theme.",
};

export default function CosmicDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="cosmic"
      className={`${cosmicDisplay.variable} font-[family-name:var(--font-cosmic-display)]`}
      style={{
        ["--font-cosmic-display" as string]: `var(--font-cosmic-display)`,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `page.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/page.tsx`:

```tsx
import { CosmicDashboardClient } from "./_components/cosmic-dashboard-client";

export default function CosmicDashboardPage() {
  return <CosmicDashboardClient />;
}
```

- [ ] **Step 3: Create empty `cosmic-dashboard-client.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

export function CosmicDashboardClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cosmic-bg text-cosmic-text">
      {mounted ? (
        <main className="relative z-10 flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-semibold tracking-wide text-cosmic-cyan">
            COSMIC MISSION CONTROL
          </h1>
        </main>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Verify dev server**

Run: `pnpm dev`
Expected: Navigate to `http://localhost:7000/en/cosmic-dashboard` (or your default locale). Page loads with deep purple/black background, "COSMIC MISSION CONTROL" text in cyan, and the Space Grotesk display font.

- [ ] **Step 5: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/
git commit -m "feat(cosmic-dashboard): add route layout, page, and empty client shell"
```

---

## Task 3: Mock data

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_lib/mock-data.ts`

- [ ] **Step 1: Create mock-data.ts**

Create `src/app/[locale]/(test)/cosmic-dashboard/_lib/mock-data.ts`:

```ts
export type KpiKey = "cpu" | "memory" | "network" | "latency";

export interface KpiConfig {
  key: KpiKey;
  label: string;
  unit: string;
  min: number;
  max: number;
  decimals: number;
  initial: number;
}

export const KPIS: KpiConfig[] = [
  { key: "cpu", label: "CPU Load", unit: "%", min: 32, max: 78, decimals: 1, initial: 54.2 },
  { key: "memory", label: "Memory", unit: "%", min: 41, max: 89, decimals: 1, initial: 67.8 },
  { key: "network", label: "Network", unit: "MB/s", min: 120, max: 980, decimals: 0, initial: 412 },
  { key: "latency", label: "Latency", unit: "ms", min: 12, max: 84, decimals: 0, initial: 34 },
];

export type ServerStatus = "online" | "degraded" | "offline";

export interface Server {
  id: string;
  name: string;
  ip: string;
  status: ServerStatus;
  uptime: number; // percentage
}

export const SERVERS: Server[] = [
  { id: "s1", name: "prod-api-01", ip: "10.0.1.21", status: "online", uptime: 99.98 },
  { id: "s2", name: "prod-api-02", ip: "10.0.1.22", status: "online", uptime: 99.92 },
  { id: "s3", name: "prod-db-01", ip: "10.0.2.11", status: "degraded", uptime: 99.41 },
  { id: "s4", name: "prod-db-02", ip: "10.0.2.12", status: "online", uptime: 99.99 },
  { id: "s5", name: "staging-web-01", ip: "10.0.3.5", status: "offline", uptime: 96.20 },
  { id: "s6", name: "edge-cdn-01", ip: "10.0.4.7", status: "online", uptime: 99.87 },
];

export type ActivityType = "info" | "success" | "warning" | "error";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  timestamp: number; // Date.now() at spawn
  message: string;
}

export const ACTIVITY_POOL: Omit<ActivityEvent, "id" | "timestamp">[] = [
  { type: "info", message: "Auth handshake completed" },
  { type: "success", message: "Deploy v2.41.0 finished" },
  { type: "warning", message: "Threshold exceeded on prod-api-02" },
  { type: "info", message: "Snapshot backup initiated" },
  { type: "success", message: "TLS cert renewed for api.cosmic.io" },
  { type: "error", message: "Anomaly detected on edge-cdn-01" },
  { type: "info", message: "Latency spike resolved" },
  { type: "success", message: "Pod restart completed" },
  { type: "warning", message: "Disk usage above 80% on prod-db-01" },
  { type: "info", message: "Cache warmed across 14 regions" },
];

export interface Endpoint {
  id: string;
  name: string;
  initialDbm: number;
  minDbm: number;
  maxDbm: number;
}

export const ENDPOINTS: Endpoint[] = [
  { id: "e1", name: "api.cosmic.io", initialDbm: -52, minDbm: -78, maxDbm: -38 },
  { id: "e2", name: "cdn.cosmic.io", initialDbm: -48, minDbm: -72, maxDbm: -34 },
  { id: "e3", name: "auth.cosmic.io", initialDbm: -61, minDbm: -84, maxDbm: -45 },
  { id: "e4", name: "db.cosmic.io", initialDbm: -55, minDbm: -80, maxDbm: -40 },
  { id: "e5", name: "ml.cosmic.io", initialDbm: -66, minDbm: -88, maxDbm: -50 },
  { id: "e6", name: "stream.cosmic.io", initialDbm: -58, minDbm: -82, maxDbm: -42 },
  { id: "e7", name: "mail.cosmic.io", initialDbm: -71, minDbm: -90, maxDbm: -55 },
  { id: "e8", name: "log.cosmic.io", initialDbm: -49, minDbm: -75, maxDbm: -36 },
];

export const SIDEBAR_NAV = [
  { icon: "Rocket", label: "Mission", active: true },
  { icon: "Server", label: "Servers" },
  { icon: "BarChart3", label: "Analytics" },
  { icon: "Bell", label: "Alerts" },
  { icon: "Network", label: "Network" },
  { icon: "FileText", label: "Logs" },
  { icon: "Settings", label: "Settings" },
] as const;
```

- [ ] **Step 2: Verify type-check**

Run: `pnpm build`
Expected: PASS (the build runs tsc, so any type errors will show)

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_lib/mock-data.ts
git commit -m "feat(cosmic-dashboard): add mock data for KPIs, servers, activity, endpoints"
```

---

## Task 4: use-ticking-mock hook

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_hooks/use-ticking-mock.ts`

- [ ] **Step 1: Implement the hook**

Create `src/app/[locale]/(test)/cosmic-dashboard/_hooks/use-ticking-mock.ts`:

```ts
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
```

- [ ] **Step 2: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_hooks/use-ticking-mock.ts
git commit -m "feat(cosmic-dashboard): add use-ticking-mock hook with seeded random walk"
```

---

## Task 5: use-cosmic-canvas hook

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_hooks/use-cosmic-canvas.ts`

- [ ] **Step 1: Implement the hook**

Create `src/app/[locale]/(test)/cosmic-dashboard/_hooks/use-cosmic-canvas.ts`:

```ts
"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  depth: number; // 0 = far, 1 = near
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
      // Easing toward target mouse
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
```

- [ ] **Step 2: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_hooks/use-cosmic-canvas.ts
git commit -m "feat(cosmic-dashboard): add use-cosmic-canvas hook for starfield and dust"
```

---

## Task 6: CosmicBackground and CosmicRipple

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-background.tsx`
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-ripple.tsx`
- Modify: `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx`

- [ ] **Step 1: Create `cosmic-background.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-background.tsx`:

```tsx
"use client";

import { useCosmicCanvas } from "../_hooks/use-cosmic-canvas";
import { CosmicRipple } from "./cosmic-ripple";

export function CosmicBackground() {
  const { starfieldRef, dustRef } = useCosmicCanvas();

  return (
    <div
      aria-hidden="true"
      data-interactive="false"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Ambient orbs (CSS) */}
      <div
        className="cosmic-float-orb absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full opacity-25 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)",
          filter: "blur(120px)",
          animation: "cosmic-float-orb 24s ease-in-out infinite",
        }}
      />
      <div
        className="cosmic-float-orb absolute -bottom-40 -right-32 h-[600px] w-[600px] rounded-full opacity-25 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          filter: "blur(120px)",
          animation: "cosmic-float-orb 32s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />
      <div
        className="cosmic-float-orb absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 mix-blend-screen"
        style={{
          background: "radial-gradient(circle, #ff2dd1 0%, transparent 70%)",
          filter: "blur(120px)",
          animation: "cosmic-float-orb 40s ease-in-out infinite",
          animationDelay: "-16s",
        }}
      />

      {/* Dust canvas (behind stars) */}
      <canvas
        ref={dustRef}
        className="absolute inset-0 h-full w-full"
        role="presentation"
      />

      {/* Starfield canvas */}
      <canvas
        ref={starfieldRef}
        className="absolute inset-0 h-full w-full"
        role="presentation"
      />

      {/* Click ripple overlay */}
      <CosmicRipple />
    </div>
  );
}
```

- [ ] **Step 2: Create `cosmic-ripple.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-ripple.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function CosmicRipple() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ripplesRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const counterRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-interactive='true']")) return;
      if (target?.closest("button, a, input, [role='button']")) return;

      const id = ++counterRef.current;
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.left = `${e.clientX}px`;
      div.style.top = `${e.clientY}px`;
      div.style.width = "120px";
      div.style.height = "120px";
      div.style.borderRadius = "50%";
      div.style.border = "2px solid rgba(34, 211, 238, 0.6)";
      div.style.pointerEvents = "none";
      div.style.transform = "translate(-50%, -50%) scale(0)";
      div.style.animation = "cosmic-ripple 800ms ease-out forwards";
      container.appendChild(div);
      ripplesRef.current.set(id, div);

      window.setTimeout(() => {
        div.remove();
        ripplesRef.current.delete(id);
      }, 850);
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    />
  );
}
```

- [ ] **Step 3: Wire into `cosmic-dashboard-client.tsx`**

Replace the contents of `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx` with:

```tsx
"use client";

import { CosmicBackground } from "./cosmic-background";

export function CosmicDashboardClient() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cosmic-bg text-cosmic-text">
      <CosmicBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-semibold tracking-wide text-cosmic-cyan">
          COSMIC MISSION CONTROL
        </h1>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Verify dev server**

Run: `pnpm dev`
Expected: Page at `/[locale]/cosmic-dashboard` shows the deep purple background, twinkling stars drifting on mouse move, soft cyan/violet/magenta orbs pulsing in the background, and a ripple appears where you click (not on the title).

- [ ] **Step 5: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/cosmic-background.tsx src/app/[locale]/\(test\)/cosmic-dashboard/_components/cosmic-ripple.tsx src/app/[locale]/\(test\)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx
git commit -m "feat(cosmic-dashboard): add cosmic background, starfield, and click ripples"
```

---

## Task 7: Glass primitives (GlassCard + GlassButton)

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/glass-card.tsx`
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/glass-button.tsx`

- [ ] **Step 1: Create `glass-card.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/glass-card.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";

type Glow = "none" | "cyan" | "violet";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: Glow;
}

export function GlassCard({
  className,
  glow = "none",
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      data-interactive="true"
      className={cn(
        "cosmic-glass relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5",
        glow === "cyan" && "hover:cosmic-glow-cyan",
        glow === "violet" && "hover:cosmic-glow-violet",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `glass-button.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/glass-button.tsx`:

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-cosmic-cyan/10 text-cosmic-cyan border-cosmic-cyan/30 hover:bg-cosmic-cyan/20 hover:shadow-[0_0_24px_rgba(34,211,238,0.4)]",
  secondary:
    "bg-cosmic-violet/10 text-cosmic-violet border-cosmic-violet/30 hover:bg-cosmic-violet/20 hover:shadow-[0_0_24px_rgba(139,92,246,0.4)]",
  ghost:
    "bg-transparent text-cosmic-text-muted border-transparent hover:bg-cosmic-glass hover:text-cosmic-text",
};

export function GlassButton({
  variant = "primary",
  className,
  children,
  ...props
}: GlassButtonProps) {
  return (
    <button
      data-interactive="true"
      className={cn(
        "cosmic-glass relative inline-flex items-center justify-center overflow-hidden rounded-full border px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300",
        "cosmic-focus-ring",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-transform before:duration-700",
        "hover:before:translate-x-full",
        variantClass[variant],
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
```

- [ ] **Step 3: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/glass-card.tsx src/app/[locale]/\(test\)/cosmic-dashboard/_components/glass-button.tsx
git commit -m "feat(cosmic-dashboard): add GlassCard and GlassButton primitives"
```

---

## Task 8: Sidebar and TopBar

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/sidebar.tsx`
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/top-bar.tsx`

- [ ] **Step 1: Create `sidebar.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/sidebar.tsx`:

```tsx
"use client";

import {
  BarChart3,
  Bell,
  FileText,
  Network,
  Rocket,
  Server,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SIDEBAR_NAV } from "../_lib/mock-data";

const ICONS: Record<string, LucideIcon> = {
  Rocket,
  Server,
  BarChart3,
  Bell,
  Network,
  FileText,
  Settings,
};

export function Sidebar() {
  return (
    <aside
      data-interactive="true"
      data-testid="cosmic-sidebar"
      className="cosmic-glass fixed left-0 top-0 z-30 hidden h-screen w-60 flex-col justify-between border-r p-5 md:flex"
      style={{ borderRadius: 0, borderTop: "none", borderBottom: "none", borderLeft: "none" }}
    >
      <div>
        <div className="mb-8 flex items-center gap-2">
          <div className="cosmic-glow-cyan h-2.5 w-2.5 rounded-full bg-cosmic-cyan" />
          <span className="text-lg font-semibold tracking-[0.2em] text-cosmic-text">
            COSMIC
          </span>
        </div>

        <nav className="space-y-1">
          {SIDEBAR_NAV.map((item) => {
            const Icon = ICONS[item.icon];
            const button = (
              <button
                data-interactive="true"
                className={cn(
                  "cosmic-focus-ring group flex w-full items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm transition-all duration-200",
                  "hover:border-cosmic-cyan/50 hover:bg-cosmic-glass hover:text-cosmic-text",
                  item.active &&
                    "border-cosmic-cyan bg-cosmic-cyan/10 text-cosmic-cyan cosmic-glow-cyan",
                  !item.active && "text-cosmic-text-muted",
                )}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            );

            return (
              <div key={item.label} className="hidden md:block lg:hidden">
                <Tooltip>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="cosmic-glass flex items-center gap-3 rounded-xl p-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-cosmic-violet/20 text-cosmic-cyan">
            CV
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-1 lg:block">
          <div className="text-sm font-medium text-cosmic-text">Cmdr. Vega</div>
          <div className="text-xs text-cosmic-text-muted">Operator</div>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create `top-bar.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/top-bar.tsx`:

```tsx
"use client";

import { Bell, ChevronRight, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface TopBarProps {
  onOpenSidebar: () => void;
}

export function TopBar({ onOpenSidebar }: TopBarProps) {
  return (
    <header
      data-interactive="true"
      className="cosmic-glass sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 md:px-6"
      style={{ borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none" }}
    >
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <button
              data-interactive="true"
              className="cosmic-focus-ring cosmic-glass flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
              onClick={onOpenSidebar}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4 text-cosmic-text" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 border-r-0 bg-cosmic-bg-raised p-0">
            <div className="md:hidden">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-cosmic-text-muted">Mission Control</span>
          <ChevronRight className="h-3.5 w-3.5 text-cosmic-text-muted" />
          <span className="text-cosmic-text">Overview</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="cosmic-glass hidden h-9 max-w-xs flex-1 items-center gap-2 rounded-full px-3 sm:flex">
          <Search className="h-3.5 w-3.5 text-cosmic-text-muted" />
          <input
            data-interactive="true"
            type="text"
            placeholder="Search systems..."
            className="cosmic-focus-ring h-full w-full bg-transparent text-sm text-cosmic-text outline-none placeholder:text-cosmic-text-muted"
          />
        </div>

        <button
          data-interactive="true"
          className="cosmic-focus-ring cosmic-glass relative flex h-9 w-9 items-center justify-center rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-cosmic-text" />
          <span className="cosmic-pulse absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cosmic-magenta" />
        </button>

        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-cosmic-violet/20 text-cosmic-cyan">
            CV
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/sidebar.tsx src/app/[locale]/\(test\)/cosmic-dashboard/_components/top-bar.tsx
git commit -m "feat(cosmic-dashboard): add Sidebar and TopBar with mobile Sheet"
```

---

## Task 9: KPI Cards

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/kpi-card.tsx`

- [ ] **Step 1: Create `kpi-card.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/kpi-card.tsx`:

```tsx
"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { GlassCard } from "./glass-card";
import { useTickingMock } from "../_hooks/use-ticking-mock";
import type { KpiConfig } from "../_lib/mock-data";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  config: KpiConfig;
}

export function KpiCard({ config }: KpiCardProps) {
  const value = useTickingMock({
    initial: config.initial,
    min: config.min,
    max: config.max,
    intervalMs: 2000 + Math.random() * 1500,
    seed: config.key.charCodeAt(0),
  });

  const previous = config.initial;
  const trend = ((value - previous) / previous) * 100;
  const isUp = trend >= 0;
  const formatted = value.toFixed(config.decimals);

  // Build sparkline path from a stable seed
  const points: number[] = [];
  let s = config.key.charCodeAt(0) * 31;
  for (let i = 0; i < 24; i++) {
    s = (s * 1103515245 + 12345) >>> 0;
    const t = (s % 1000) / 1000;
    points.push(config.min + (config.max - config.min) * t);
  }
  const maxP = Math.max(...points);
  const minP = Math.min(...points);
  const range = maxP - minP || 1;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - ((p - minP) / range) * 100;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <GlassCard glow="cyan" className="flex flex-col gap-3">
      <div className="text-xs uppercase tracking-widest text-cosmic-text-muted">
        {config.label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-semibold text-cosmic-text">
          {formatted}
        </span>
        <span className="text-sm text-cosmic-text-muted">{config.unit}</span>
      </div>
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
            isUp
              ? "border-cosmic-success/30 text-cosmic-success"
              : "border-cosmic-magenta/30 text-cosmic-magenta",
          )}
        >
          {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {Math.abs(trend).toFixed(1)}%
        </div>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-8 w-24"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`spark-${config.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.5)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
          </defs>
          <path
            d={`${path} L 100 100 L 0 100 Z`}
            fill={`url(#spark-${config.key})`}
            stroke="none"
          />
          <path
            d={path}
            fill="none"
            stroke="rgb(34,211,238)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/kpi-card.tsx
git commit -m "feat(cosmic-dashboard): add KPI card with sparkline and trend pill"
```

---

## Task 10: Live Chart

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/live-chart.tsx`

- [ ] **Step 1: Create `live-chart.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/live-chart.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { GlassCard } from "./glass-card";

const POINTS = 60;
const INTERVAL_MS = 1500;
const MAX_RANGE = 1000; // MB/s

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function LiveChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataRef = useRef<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [peak, setPeak] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rand = mulberry32(7);
    let last = 500;
    for (let i = 0; i < POINTS; i++) {
      last += (rand() - 0.5) * 120;
      last = Math.max(120, Math.min(MAX_RANGE - 100, last));
      dataRef.current.push(last);
    }
    setCurrent(Math.round(last));
    setPeak(Math.round(Math.max(...dataRef.current)));

    let raf: number | null = null;
    let interval: number | null = null;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(122, 139, 191, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const y = (h * i) / 4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const data = dataRef.current;
      const max = MAX_RANGE;
      const stepX = w / (POINTS - 1);

      // Area fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(34, 211, 238, 0.35)");
      grad.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, h);
      data.forEach((v, i) => {
        const x = i * stepX;
        const y = h - (v / max) * h;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // Line
      ctx.strokeStyle = "rgb(34, 211, 238)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      data.forEach((v, i) => {
        const x = i * stepX;
        const y = h - (v / max) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    const advance = () => {
      if (reduceMotion) return;
      const last = dataRef.current[dataRef.current.length - 1] ?? 500;
      const next = Math.max(
        120,
        Math.min(MAX_RANGE - 100, last + (Math.random() - 0.5) * 180),
      );
      dataRef.current = [...dataRef.current.slice(1), next];
      setCurrent(Math.round(next));
      setPeak((p) => Math.max(p, Math.round(next)));
      draw();
    };

    draw();
    if (!reduceMotion) {
      interval = window.setInterval(advance, INTERVAL_MS);
    }

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    return () => {
      if (interval) clearInterval(interval);
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <GlassCard glow="cyan" className="flex h-full flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-cosmic-text-muted">
            Network Throughput
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold text-cosmic-text">
            {current}{" "}
            <span className="text-sm text-cosmic-text-muted">MB/s</span>
          </div>
        </div>
        <div className="text-right text-xs text-cosmic-text-muted">
          <div>
            Peak:{" "}
            <span className="font-mono text-cosmic-violet">{peak} MB/s</span>
          </div>
          <div>Last 90s</div>
        </div>
      </div>
      <div className="relative h-48 w-full">
        <canvas ref={canvasRef} className="h-full w-full" role="presentation" />
      </div>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/live-chart.tsx
git commit -m "feat(cosmic-dashboard): add live line chart with sliding data"
```

---

## Task 11: Radar Scanner

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/radar-scanner.tsx`

- [ ] **Step 1: Create `radar-scanner.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/radar-scanner.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { GlassCard } from "./glass-card";

interface Blip {
  x: number; // 0-1
  y: number; // 0-1
  r: number; // 0-1 distance from center
  angle: number; // radians
  born: number;
  lifespan: number;
  anomaly: boolean;
}

const BLIP_COUNT = 4;
const ROTATION_PERIOD_MS = 4000;

export function RadarScanner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const blipsRef = useRef<Blip[]>([]);
  const rotationRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const seedRand = (() => {
      let s = 0xabcdef;
      return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
      };
    })();

    const spawnBlip = (now: number): Blip => ({
      x: 0,
      y: 0,
      r: 0.2 + seedRand() * 0.7,
      angle: seedRand() * Math.PI * 2,
      born: now,
      lifespan: 3000 + seedRand() * 5000,
      anomaly: seedRand() < 0.3,
    });

    blipsRef.current = Array.from({ length: BLIP_COUNT }, () =>
      spawnBlip(performance.now()),
    );

    const resizeAndDraw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = canvas.clientWidth;
      canvas.width = Math.floor(size * dpr);
      canvas.height = Math.floor(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 8;

      ctx.clearRect(0, 0, size, size);

      // Concentric rings
      ctx.strokeStyle = "rgba(34, 211, 238, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius * i) / 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Cross-hair
      ctx.strokeStyle = "rgba(34, 211, 238, 0.15)";
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Sweep
      const sweepAngle = reduceMotion ? -Math.PI / 2 : rotationRef.current;
      const sweepGrad = ctx.createConicGradient
        ? ctx.createConicGradient(sweepAngle, cx, cy)
        : null;
      if (sweepGrad) {
        sweepGrad.addColorStop(0, "rgba(34, 211, 238, 0.45)");
        sweepGrad.addColorStop(0.08, "rgba(139, 92, 246, 0.1)");
        sweepGrad.addColorStop(1, "rgba(34, 211, 238, 0)");
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Blips
      const now = performance.now();
      const activeBlips: Blip[] = [];
      for (const b of blipsRef.current) {
        const age = now - b.born;
        if (age > b.lifespan) {
          activeBlips.push(spawnBlip(now));
          continue;
        }
        activeBlips.push(b);
        const fadeIn = Math.min(1, age / 300);
        const fadeOut = Math.min(1, (b.lifespan - age) / 300);
        const alpha = fadeIn * fadeOut;
        const px = cx + Math.cos(b.angle) * b.r * radius;
        const py = cy + Math.sin(b.angle) * b.r * radius;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = b.anomaly
          ? `rgba(255, 45, 209, ${alpha})`
          : `rgba(34, 211, 238, ${alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.strokeStyle = b.anomaly
          ? `rgba(255, 45, 209, ${alpha * 0.4})`
          : `rgba(34, 211, 238, ${alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      blipsRef.current = activeBlips;
    };

    let raf: number | null = null;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!reduceMotion) {
        rotationRef.current += (dt / ROTATION_PERIOD_MS) * Math.PI * 2;
      }
      resizeAndDraw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => resizeAndDraw());
    ro.observe(canvas);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <GlassCard glow="violet" className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-cosmic-text-muted">
          Sector Scanner
        </div>
        <div className="flex items-center gap-1.5 text-xs text-cosmic-text-muted">
          <span className="cosmic-pulse h-1.5 w-1.5 rounded-full bg-cosmic-cyan" />
          SCANNING
        </div>
      </div>
      <div className="relative aspect-square w-full">
        <canvas ref={canvasRef} className="h-full w-full" role="presentation" />
      </div>
      <div className="flex items-center justify-between text-xs text-cosmic-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cosmic-cyan" />
          Friendly
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-cosmic-magenta" />
          Anomaly
        </div>
      </div>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/radar-scanner.tsx
git commit -m "feat(cosmic-dashboard): add radar scanner with rotating sweep and blips"
```

---

## Task 12: Server List

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/server-list.tsx`

- [ ] **Step 1: Create `server-list.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/server-list.tsx`:

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { SERVERS, type ServerStatus } from "../_lib/mock-data";

const FILTERS: { label: string; value: ServerStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Online", value: "online" },
  { label: "Degraded", value: "degraded" },
  { label: "Offline", value: "offline" },
];

const STATUS_STYLES: Record<ServerStatus, string> = {
  online: "bg-cosmic-success/20 text-cosmic-success border-cosmic-success/40",
  degraded: "bg-cosmic-warning/20 text-cosmic-warning border-cosmic-warning/40",
  offline: "bg-cosmic-magenta/20 text-cosmic-magenta border-cosmic-magenta/40",
};

function StatusDot({ status }: { status: ServerStatus }) {
  const color =
    status === "online"
      ? "bg-cosmic-success"
      : status === "degraded"
        ? "bg-cosmic-warning"
        : "bg-cosmic-magenta";
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={cn("cosmic-pulse absolute inline-flex h-full w-full rounded-full opacity-75", color)}
      />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}

function SignalBarMini({ uptime }: { uptime: number }) {
  const segments = 5;
  const filled = Math.round((uptime / 100) * segments);
  return (
    <div className="flex items-end gap-0.5">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm",
            i < filled ? "bg-cosmic-cyan" : "bg-cosmic-text-muted/20",
          )}
          style={{ height: `${4 + i * 2}px` }}
        />
      ))}
    </div>
  );
}

export function ServerList() {
  const [filter, setFilter] = useState<ServerStatus | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered =
    filter === "all" ? SERVERS : SERVERS.filter((s) => s.status === filter);

  return (
    <GlassCard glow="cyan" className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-cosmic-text-muted">
          Servers
        </div>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              data-interactive="true"
              onClick={() => setFilter(f.value)}
              className={cn(
                "cosmic-focus-ring rounded-full border px-2.5 py-0.5 text-xs transition-all",
                filter === f.value
                  ? "border-cosmic-cyan/50 bg-cosmic-cyan/10 text-cosmic-cyan"
                  : "border-transparent text-cosmic-text-muted hover:text-cosmic-text",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cosmic-scrollbar -mx-1 max-h-64 space-y-1 overflow-y-auto px-1">
        {filtered.map((s) => (
          <button
            key={s.id}
            data-interactive="true"
            onClick={() => setSelected(s.id)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-all",
              "hover:border-cosmic-cyan/30 hover:bg-cosmic-glass",
              selected === s.id && "border-cosmic-cyan/50 bg-cosmic-cyan/5 cosmic-glow-cyan",
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <StatusDot status={s.status} />
              <div className="min-w-0">
                <div className="truncate text-sm text-cosmic-text">{s.name}</div>
                <div className="font-mono text-xs text-cosmic-text-muted">{s.ip}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-cosmic-text-muted">
                {s.uptime.toFixed(2)}%
              </span>
              <SignalBarMini uptime={s.uptime} />
              <span
                className={cn(
                  "hidden rounded-full border px-2 py-0.5 text-xs uppercase tracking-wider sm:inline",
                  STATUS_STYLES[s.status],
                )}
              >
                {s.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/server-list.tsx
git commit -m "feat(cosmic-dashboard): add server list with status pills and filter chips"
```

---

## Task 13: Activity Feed

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/activity-feed.tsx`

- [ ] **Step 1: Create `activity-feed.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/activity-feed.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { ACTIVITY_POOL, type ActivityEvent, type ActivityType } from "../_lib/mock-data";

const TYPE_DOT: Record<ActivityType, string> = {
  info: "bg-cosmic-cyan",
  success: "bg-cosmic-success",
  warning: "bg-cosmic-warning",
  error: "bg-cosmic-magenta",
};

const INITIAL_COUNT = 8;
const VISIBLE_COUNT = 8;
const SPAWN_MIN_MS = 3000;
const SPAWN_MAX_MS = 5000;

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>(() => {
    const now = Date.now();
    return ACTIVITY_POOL.slice(0, INITIAL_COUNT)
      .map((e, i) => ({
        ...e,
        id: `init-${i}`,
        timestamp: now - (INITIAL_COUNT - i) * 4500,
      }))
      .reverse();
  });
  const [newestId, setNewestId] = useState<string | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timeout: number | null = null;

    const schedule = () => {
      const delay = SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS);
      timeout = window.setTimeout(() => {
        const pool = ACTIVITY_POOL[Math.floor(Math.random() * ACTIVITY_POOL.length)];
        const id = `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setEvents((prev) => {
          const next: ActivityEvent[] = [
            { ...pool, id, timestamp: Date.now() },
            ...prev,
          ];
          return next.slice(0, VISIBLE_COUNT);
        });
        setNewestId(id);
        if (!reduceMotion) {
          window.setTimeout(() => setNewestId((cur) => (cur === id ? null : cur)), 600);
        }
        schedule();
      }, delay);
    };

    schedule();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <GlassCard glow="violet" className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-cosmic-text-muted">
          Activity
        </div>
        <div className="flex items-center gap-1.5 text-xs text-cosmic-cyan">
          <span className="cosmic-pulse h-1.5 w-1.5 rounded-full bg-cosmic-cyan" />
          LIVE
        </div>
      </div>

      <div className="cosmic-scrollbar -mx-1 max-h-64 space-y-1 overflow-y-auto px-1">
        {events.map((e) => (
          <div
            key={e.id}
            className={cn(
              "flex items-start gap-2.5 rounded-md px-2 py-1.5 transition-all",
              newestId === e.id && "cosmic-slide-in bg-cosmic-cyan/5",
            )}
          >
            <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", TYPE_DOT[e.type])} />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-cosmic-text">{e.message}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-cosmic-text-muted">
                {formatTime(e.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/activity-feed.tsx
git commit -m "feat(cosmic-dashboard): add rolling activity feed with slide-in animation"
```

---

## Task 14: Signal Bars

**Files:**
- Create: `src/app/[locale]/(test)/cosmic-dashboard/_components/signal-bars.tsx`

- [ ] **Step 1: Create `signal-bars.tsx`**

Create `src/app/[locale]/(test)/cosmic-dashboard/_components/signal-bars.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";
import { ENDPOINTS } from "../_lib/mock-data";

const SEGMENTS = 5;
const UPDATE_MS = 3000;

function dbmToLevel(dbm: number, min: number, max: number): number {
  const t = (dbm - min) / (max - min);
  return Math.max(0, Math.min(1, t));
}

export function SignalBars() {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(ENDPOINTS.map((e) => [e.id, e.initialDbm])),
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setValues((prev) => {
        const next: Record<string, number> = { ...prev };
        for (const e of ENDPOINTS) {
          const cur = prev[e.id] ?? e.initialDbm;
          const target = e.minDbm + Math.random() * (e.maxDbm - e.minDbm);
          const next2 = cur + (target - cur) * 0.4 + (Math.random() - 0.5) * 4;
          next[e.id] = Math.max(e.minDbm, Math.min(e.maxDbm, next2));
        }
        return next;
      });
    }, UPDATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-cosmic-text-muted">
          Signal Strength
        </div>
        <div className="text-xs text-cosmic-text-muted">Last 30s</div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {ENDPOINTS.map((e) => {
          const dbm = values[e.id] ?? e.initialDbm;
          const level = dbmToLevel(dbm, e.minDbm, e.maxDbm);
          const filled = Math.round(level * SEGMENTS);
          return (
            <div
              key={e.id}
              className="cosmic-glass flex items-center justify-between gap-3 rounded-lg px-3 py-2"
            >
              <span className="truncate font-mono text-xs text-cosmic-text">
                {e.name}
              </span>
              <div className="flex items-end gap-0.5">
                {Array.from({ length: SEGMENTS }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1.5 rounded-sm transition-all duration-700",
                      i < filled
                        ? "bg-gradient-to-t from-cosmic-violet to-cosmic-cyan"
                        : "bg-cosmic-text-muted/20",
                    )}
                    style={{ height: `${5 + i * 2.5}px` }}
                  />
                ))}
              </div>
              <span className="w-14 text-right font-mono text-xs text-cosmic-text-muted">
                {Math.round(dbm)} dBm
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/signal-bars.tsx
git commit -m "feat(cosmic-dashboard): add signal bars with ticking endpoint values"
```

---

## Task 15: Final assembly & responsive QA

**Files:**
- Modify: `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx`

- [ ] **Step 1: Replace `cosmic-dashboard-client.tsx` with full grid**

Replace the contents of `src/app/[locale]/(test)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx` with:

```tsx
"use client";

import { CosmicBackground } from "./cosmic-background";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { KpiCard } from "./kpi-card";
import { LiveChart } from "./live-chart";
import { RadarScanner } from "./radar-scanner";
import { ServerList } from "./server-list";
import { ActivityFeed } from "./activity-feed";
import { SignalBars } from "./signal-bars";
import { KPIS } from "../_lib/mock-data";

export function CosmicDashboardClient() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cosmic-bg text-cosmic-text">
      <CosmicBackground />

      <Sidebar />

      <div className="relative z-10 md:ml-16 lg:ml-60">
        <TopBar onOpenSidebar={() => {}} />

        <main className="space-y-6 p-4 md:p-6">
          {/* KPI row */}
          <section
            aria-label="Key performance indicators"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {KPIS.map((k) => (
              <KpiCard key={k.key} config={k} />
            ))}
          </section>

          {/* Chart + Radar row */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LiveChart />
            </div>
            <RadarScanner />
          </section>

          {/* Server list + Activity feed row */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ServerList />
            <ActivityFeed />
          </section>

          {/* Signal bars row */}
          <section>
            <SignalBars />
          </section>

          <footer className="pb-2 pt-4 text-center font-mono text-xs text-cosmic-text-muted">
            COSMIC MISSION CONTROL · OPERATOR CONSOLE · SECTOR 7G
          </footer>
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Visual QA at desktop width (≥1280px)**

Run: `pnpm dev`

Open `http://localhost:7000/en/cosmic-dashboard`. Verify:
- [ ] Background shows twinkling stars that drift on mouse movement
- [ ] Three soft glowing orbs visible (cyan top-left, violet bottom-right, magenta center)
- [ ] Clicking on the background (not on a card/button) spawns a cyan ring that expands and fades
- [ ] Sidebar (240px) visible on the left with logo, 7 nav items (Mission active with cyan glow), user card at bottom
- [ ] TopBar shows breadcrumb, search input (hidden on very narrow), bell with magenta dot, avatar
- [ ] 4 KPI cards across the top with ticking numbers, trend pills, and cyan sparklines
- [ ] Live chart shows cyan line + area, with values updating every ~1.5s
- [ ] Radar scanner shows rotating sweep and 4 colored blips
- [ ] Server list shows 6 rows, filter chips work (try clicking "Degraded" and "Offline")
- [ ] Activity feed shows entries with newest animating in at the top every 3-5s
- [ ] Signal bars show 8 endpoints in 4 columns, values updating every 3s

- [ ] **Step 3: Visual QA at tablet width (768-1023px)**

Resize browser to ~900px wide. Verify:
- [ ] Sidebar collapses to icon-only (64px)
- [ ] KPI cards are 2x2
- [ ] Chart is full width, radar is below it
- [ ] Server list and activity are stacked

- [ ] **Step 4: Visual QA at mobile width (<768px)**

Resize browser to ~400px wide. Verify:
- [ ] Sidebar is hidden
- [ ] Hamburger button appears in top bar; clicking opens Sheet with sidebar
- [ ] All sections stack vertically
- [ ] KPI cards are 2x2
- [ ] Signal bars are 1 column (or 2 columns on landscape phones)

- [ ] **Step 5: Visual QA with reduced motion**

In OS settings, enable "Reduce motion" (or use Chrome DevTools "Emulate CSS prefers-reduced-motion: reduce"). Reload page. Verify:
- [ ] Stars are static (no twinkle, no parallax drift)
- [ ] Dust is static
- [ ] Orbs are static (no float)
- [ ] Clicking background does NOT spawn a ripple
- [ ] Activity feed entries still appear (no slide-in animation)
- [ ] Chart, KPI values, signal bars, and radar still update (these are functional updates, not decorative motion)

- [ ] **Step 6: Final lint and build**

Run: `pnpm lint && pnpm build`
Expected: PASS with zero errors and zero warnings (other than the ones already present pre-change)

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/\(test\)/cosmic-dashboard/_components/cosmic-dashboard-client.tsx
git commit -m "feat(cosmic-dashboard): assemble full dashboard grid with responsive layout"
```

---

## Self-Review

**1. Spec coverage:**
- ✅ Visual language (color tokens) — Task 1
- ✅ Typography (Space Grotesk + Geist) — Task 2
- ✅ Particle system (starfield, dust, orbs) — Task 5, 6
- ✅ Click ripples — Task 6
- ✅ Layout (responsive grid) — Task 15
- ✅ All 13 components — Tasks 6, 7, 8, 9, 10, 11, 12, 13, 14
- ✅ Both hooks — Tasks 4, 5
- ✅ Mock data — Task 3
- ✅ Accessibility (reduced motion, focus rings, aria-hidden) — Tasks 1, 2, 6, 15
- ✅ Performance (DPR cap, visibility pause, shared rAF) — Task 5
- ✅ No new runtime deps — confirmed (only lucide-react which is already in package.json)

**2. Placeholder scan:** No "TBD", "TODO", "implement later", "fill in details", or vague steps. Every code block is complete.

**3. Type consistency:**
- `KpiConfig` used consistently across mock-data, KpiCard, and dashboard-client ✓
- `Server`/`ServerStatus` used consistently across mock-data and ServerList ✓
- `ActivityEvent`/`ActivityType` used consistently across mock-data and ActivityFeed ✓
- `Endpoint` used consistently across mock-data and SignalBars ✓
- `SIDEBAR_NAV` icon string keys (`"Rocket"`, etc.) map to actual imports in Sidebar ✓
- `CosmicCanvas` shape (`{ starfieldRef, dustRef }`) matches hook return and CosmicBackground usage ✓
- `useTickingMock` options match its KpiCard usage ✓
- All `data-interactive` attributes align with the CosmicRipple exclusion logic ✓
