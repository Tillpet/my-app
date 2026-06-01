# Cosmic Dashboard — Design Spec

**Date:** 2026-06-01
**Route:** `src/app/[locale]/(test)/cosmic-dashboard/`
**Status:** Approved (pending user review of written spec)

## Purpose

A single-page "Mission Control" style dashboard that doubles as a visual showcase for a futuristic cosmic UI design system. Demonstrates glassmorphism, neon glow, micro-particle systems, and real-time data visualization in a cyberpunk / sci-fi aesthetic. Lives under the `(test)` route group alongside existing test pages (`dashboard1`, `glass`, `css-animate`, etc.).

## Goals

1. Showcase a complete futuristic dark UI in a single page
2. Establish reusable cosmic-themed components (glass cards/buttons, particle background, neon glow utilities) that can be lifted into other routes later
3. Demonstrate real-time-feeling data without any real backend (mock data that ticks)
4. Be fully responsive (desktop sidebar → tablet icon rail → mobile slide-over)
5. Respect accessibility (`prefers-reduced-motion`, focus rings, color contrast AAA)
6. Maintain 60fps on the particle system even on 8K displays (DPR-capped canvas)

## Non-Goals

- No real authentication, no real API calls
- No multi-page app shell (single route only)
- No theme switcher (dark only — light mode would dilute the cosmic concept)
- No internationalization of mock data labels (English strings; labels are minimal and aesthetic)
- No new third-party particle libraries (canvas + CSS only)

## Visual Language

### Color Tokens (added to `globals.css` under `[data-theme="cosmic"]`)

| Token | Value | Usage |
|---|---|---|
| `--cosmic-bg` | `#030014` | Page background |
| `--cosmic-bg-raised` | `#0a0420` | Sidebar / topbar |
| `--cosmic-glass` | `rgba(255,255,255,0.04)` | Card surface |
| `--cosmic-glass-strong` | `rgba(255,255,255,0.08)` | Hovered surface |
| `--cosmic-cyan` | `#22d3ee` | Primary glow / accent |
| `--cosmic-cyan-bright` | `#00f0ff` | Highlight / focus |
| `--cosmic-violet` | `#8b5cf6` | Secondary glow |
| `--cosmic-violet-bright` | `#a855f7` | Highlight |
| `--cosmic-magenta` | `#ff2dd1` | Alert / danger accent |
| `--cosmic-text` | `#e0e7ff` | Primary text |
| `--cosmic-text-muted` | `#7a8bbf` | Secondary text |
| `--cosmic-border` | `rgba(34,211,238,0.15)` | Glass border inner |
| `--cosmic-border-glow` | `rgba(139,92,246,0.2)` | Glass border outer halo |
| `--cosmic-success` | `#10ffb0` | Online status |

A new `[data-theme="cosmic"]` block will be added to `@layer theme` in `globals.css`. All cosmic utilities use `--color-cosmic-*` Tailwind tokens registered in `@theme inline` so they're usable as `bg-cosmic-cyan`, `text-cosmic-violet`, etc.

### Typography

- **Display headings:** `Space Grotesk` (Google Font, loaded via `next/font/google` in the route's `layout.tsx`, registered as `--font-cosmic-display`)
- **Body:** `Geist Sans` (already in `src/app/[locale]/layout.tsx`)
- **Mono / numeric data:** `Geist Mono` (already in `src/app/[locale]/layout.tsx`)

Sizes follow shadcn defaults (text-sm, text-base, text-lg, text-2xl for KPI numbers, text-4xl for hero, etc.). Display font is reserved for the dashboard title and section headings.

## Layout

### Breakpoints

- `lg+` (≥1024px): full sidebar (240px) + main grid
- `md` (≥768px, <1024px): collapsed icon sidebar (64px) + main grid
- `<md`: mobile; sidebar becomes a shadcn `Sheet` slide-over triggered by a hamburger button in the top bar

### Main Grid (lg+)

```
┌─────────────────┬──────────────────────────────────────────────────┐
│                 │ TopBar (h-16)                                     │
│                 ├──────────────────────────────────────────────────┤
│                 │ [KPI 1] [KPI 2] [KPI 3] [KPI 4]   ← 4-col row     │
│   Sidebar       ├──────────────────────────────────────────────────┤
│   240px         │ Live Chart        │ Radar Scanner                 │
│   (icon         │ 2/3 col           │ 1/3 col                       │
│    nav +        ├───────────────────┴───────────────────────────────┤
│    logo +       │ Server List       │ Activity Feed                 │
│    user)        │ 1/2 col           │ 1/2 col                       │
│                 ├──────────────────────────────────────────────────┤
│                 │ Signal Bars (1 row, 8 endpoints)                  │
└─────────────────┴──────────────────────────────────────────────────┘
```

### Main Grid (md)

- KPI cards: 2×2
- Chart: full width
- Radar: full width
- Server list + activity: stacked
- Signal bars: 2 rows of 4

### Main Grid (mobile)

- KPI: 2×2
- Everything else: stacked, full width
- Sidebar replaced by Sheet

## Particle / Background System

Three fixed layers at `z-0`, content at `z-10`, interactive overlays at `z-50`.

### Layer 1 — Starfield (HTML5 Canvas, DPR-aware)

- ~220 stars total
- 2 depth layers:
  - **Far layer (180 stars):** radius 0.3–0.8px, max parallax 4px, slow twinkle (period 3–6s)
  - **Near layer (40 stars):** radius 0.8–1.6px, max parallax 12px, faster twinkle (period 1.5–3s)
- Each star has independent twinkle phase (sin-based opacity 0.3 → 1)
- Mouse-move updates a parallax offset (rAF throttled, no React re-render)
- DPR capped at 2× to keep performance on 4K/8K displays
- `requestAnimationFrame` loop pauses when `document.hidden`

### Layer 2 — Cosmic Dust (HTML5 Canvas)

- 40 motes, radius 0.5–1.2px
- Slow random velocity (0.05–0.2 px/frame)
- Wrap on viewport edges
- Opacity 0.1–0.4
- Same rAF loop, paused with starfield

### Layer 3 — Ambient Orbs (CSS / divs)

- 3 absolutely positioned divs, each `~600px` diameter
- Background: `radial-gradient(circle, <color> 0%, transparent 70%)`
- Filter: `blur(120px)`, `mix-blend-mode: screen`, opacity 0.25
- Orb 1: cyan, top-left, 24s float cycle
- Orb 2: violet, bottom-right, 32s float cycle (negative delay)
- Orb 3: magenta, center, 40s float cycle (negative delay)

### Interactive Overlays

- **Cursor parallax:** updates Layer 1/2 offset based on mouse position
- **Click ripple:** on any background click (but not on interactive elements), spawn a `<div>` at click coords that animates `scale 0→3, opacity 0.6→0` over 800ms, then removes itself
- **Reduced motion:** static stars (no twinkle), no dust drift, no orbs, no ripples

## Components

All components live in `src/app/[locale]/(test)/cosmic-dashboard/_components/`.

### `cosmic-background.tsx` (Client)
- Mounts the two canvas elements (starfield + dust) and the three orb divs
- Renders the `CosmicRipple` overlay as a child (so background clicks are caught here)
- Self-contained: no props, no context, no parent state

### `cosmic-ripple.tsx` (Client)
- Renders a `position: fixed inset-0 pointer-events-none` container that holds ripple elements
- Internally listens for `click` on `window`, but **only spawns a ripple if the click target is not inside a `[data-interactive]` element** (interactive elements opt-out by setting `data-interactive`)
- Manages a pool of ripple `<div>`s that animate `scale 0→3, opacity 0.6→0` over 800ms and self-remove
- No public API — purely a side-effect component

### `sidebar.tsx` (Client)
- Logo at top (text "COSMIC" in Space Grotesk, small cyan glow)
- Nav items (lucide icons + label): Mission, Servers, Analytics, Alerts, Network, Logs, Settings
- Mission is active (highlighted with cyan border-left + glow)
- User card at bottom: avatar + name "Cmdr. Vega" + role "Operator"
- Collapsed (md) variant: icons only with tooltips (shadcn `Tooltip`)
- Mobile: hidden entirely, replaced by Sheet

### `top-bar.tsx` (Client)
- Left: hamburger button (mobile only) + breadcrumb "Mission Control / Overview"
- Center: search input with cyan focus ring, placeholder "Search systems..."
- Right: notification bell (with small magenta dot), avatar

### `kpi-card.tsx` (Client)
- Props: `{ label: string; value: number; unit: string; trend: number; sparkline: number[] }`
- Layout: label (muted, mono) → value (display, large) → trend pill (green/red glow)
- Mini sparkline rendered as SVG path, color matches trend direction
- Background: glass surface, hover lifts `translateY(-2px)` and intensifies border glow
- Value ticks every 2–4s via `use-ticking-mock`

### `live-chart.tsx` (Client)
- Canvas-based line chart, 60 data points
- Y-axis auto-scales to min/max with 10% padding
- X-axis: time labels every 10 points ("-60s", "-50s", ...)
- Line: cyan stroke, 1.5px
- Area fill: vertical gradient from cyan (top, 30% alpha) to transparent
- Updates every 1.5s — new point slides in from right, oldest drops off left
- Subtle horizontal grid lines at 25/50/75% height, very low opacity

### `radar-scanner.tsx` (Client)
- Canvas, ~300×300px
- Concentric circles (3 rings) at 25/50/100% radius
- Cross-hair lines
- Rotating sweep beam (radial gradient from cyan-violet to transparent, 30° arc, 4s full rotation)
- 4 "blips" at random positions; each appears for 3–8s with fade-in/out
- Blip color: cyan for friendly, magenta for anomaly

### `server-list.tsx` (Client)
- Header: "Servers" + filter chips (All, Online, Degraded, Offline)
- 6 server rows: name, IP (mono), status pill (pulsing glow), uptime %, signal bars mini
- Status colors: green (online), amber (degraded), red (offline)
- Click row → highlight with cyan border

### `activity-feed.tsx` (Client)
- Header: "Activity" + "Live" indicator (pulsing cyan dot)
- Scrollable list (max-h), custom thin scrollbar
- 8 visible entries, newest at top with slide-in animation
- Each entry: colored glow dot, timestamp (mono), message
- Dot colors map to entry type: cyan (info), green (success), amber (warning), magenta (error)
- New entry every 3–5s

### `signal-bars.tsx` (Client)
- Header: "Signal Strength"
- 8 endpoint rows: name, 5-segment bar, value in dBm
- Bar fill: gradient from cyan to violet
- Values update every 3s within realistic ranges

### `glass-card.tsx` (Client)
- Wrapper component, props: `{ children, className, glow?: 'cyan' | 'violet' | 'none' }`
- Renders a div with cosmic glass styling
- Optional glow adds an outer box-shadow halo

### `glass-button.tsx` (Client)
- Variants: `primary` (cyan), `secondary` (violet), `ghost` (transparent)
- Hover: shine sweep (CSS pseudo-element sliding left→right)
- Focus: 2px cyan ring
- Built on shadcn `Button` primitive, not a full re-implementation

## Hooks

### `use-cosmic-canvas.ts`
- Manages starfield + dust rAF loop in a single shared rAF
- Handles DPR scaling (capped at 2×), `ResizeObserver` (debounced 100ms), `visibilitychange` pause
- Returns `{ starfieldRef, dustRef, mouseParallax }` where `mouseParallax` is a ref-like object the consumer reads each frame
- No ripple logic (lives in `cosmic-ripple.tsx`)

### `use-ticking-mock.ts`
- Returns a `value` that updates every `intervalMs` (default 2500ms)
- Uses a stable seeded RNG (mulberry32) so SSR and first client render match
- Walks the value via random walk with reflection at min/max

## File Structure

```
src/app/[locale]/(test)/cosmic-dashboard/
├── page.tsx                      # server component, renders <CosmicDashboardClient />
├── layout.tsx                    # client wrapper with fonts + theme provider
├── _components/
│   ├── cosmic-background.tsx
│   ├── cosmic-ripple.tsx
│   ├── sidebar.tsx
│   ├── top-bar.tsx
│   ├── kpi-card.tsx
│   ├── live-chart.tsx
│   ├── radar-scanner.tsx
│   ├── server-list.tsx
│   ├── activity-feed.tsx
│   ├── signal-bars.tsx
│   ├── glass-card.tsx
│   ├── glass-button.tsx
│   └── cosmic-dashboard-client.tsx  # client root composing all widgets
├── _hooks/
│   ├── use-cosmic-canvas.ts
│   └── use-ticking-mock.ts
├── _lib/
│   └── mock-data.ts
└── cosmic-dashboard.css          # cosmic keyframes, glow utilities, scrollbar
```

Plus:
- Append `[data-theme="cosmic"]` block + `--color-cosmic-*` tokens to `src/app/globals.css`
- Append cosmic-specific font registration to `src/app/[locale]/(test)/cosmic-dashboard/layout.tsx`

## Mock Data

Static seed data + ticking logic. Realistic but obviously fake.

**KPIs (4):**
- CPU Load: 32–78% → 1 decimal
- Memory: 41–89% → 1 decimal
- Network: 120–980 MB/s → 0 decimals
- Latency: 12–84 ms → 0 decimals

**Servers (6):**
- prod-api-01, prod-api-02, prod-db-01, prod-db-02, staging-web-01, edge-cdn-01
- Mix of statuses (4 online, 1 degraded, 1 offline)
- IPs: 10.0.x.x private range
- Uptime: 99.0–99.99%

**Activity (initial 8 + rolling):**
- Mix of: Auth OK, Deploy complete, Threshold exceeded, Anomaly detected, Backup complete, Cert renewed, Latency spike, Pod restart

**Endpoints (8 signal bars):**
- api.cosmic.io, cdn.cosmic.io, auth.cosmic.io, db.cosmic.io, ml.cosmic.io, stream.cosmic.io, mail.cosmic.io, log.cosmic.io

**Radar blips:**
- 4 random blips within the radar area, lifespans 3–8s

## Accessibility

- All interactive elements are real `<button>`, `<a>`, or `role="button"` with keyboard support
- Focus ring: `2px solid var(--cosmic-cyan-bright)` with `box-shadow: 0 0 0 4px rgba(34,211,238,0.3)`
- `prefers-reduced-motion: reduce` disables: star twinkle, dust drift, orb float, ripples, KPI value transitions, radar sweep, activity feed slide-in. Static rendering instead.
- `aria-label` on icon-only buttons (hamburger, bell, nav items in collapsed mode)
- `aria-live="polite"` on activity feed and KPI values for screen readers
- Color is never the only status indicator (server status has both color and a text label)
- Body text contrast: `#e0e7ff` on `#030014` ≈ 16:1 (AAA)
- All canvases have a `role="presentation"` and `aria-hidden="true"` (purely decorative)

## Performance

- Single rAF loop shared by starfield + dust (not separate)
- Canvas pixel ratio capped at 2× to avoid 4K/8K fillrate
- `ResizeObserver` debounced at 100ms
- rAF paused via `document.visibilitychange` listener
- All mock data generators use seeded RNG — no `Math.random()` per frame
- Initial bundle: no new runtime dependencies
- First contentful paint target: < 1.5s on mid-range hardware (background is non-blocking, content renders immediately over it)

## Out of Scope (Future)

- Real backend integration of KPIs/servers
- Theme switcher (light mode)
- Multi-page navigation (Servers/Alerts/etc. routes)
- Internationalized labels
- E2E tests for the dashboard (visual demos are notoriously hard to test)
