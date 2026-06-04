# Home UI Redesign — Design Spec

**Date:** 2026-06-04
**Status:** Draft (pending user approval)
**Scope:** `src/app/[locale]/home/` route

## Problem

The current home page is bloated: 7 sections, custom gradients, hand-rolled animations, a string-keyed icon lookup, and a separate mobile-nav component duplicating the desktop nav. All of this fights the shadcn default aesthetic and adds maintenance surface.

## Goal

Refactor the home page to a clean, minimal landing that uses stock shadcn components, semantic colors only, no custom gradients, no custom animation primitives, and no image assets. Reduce component count, reduce data shape, and align with the rest of the project (`new-york` style, radix base, lucide icons, Tailwind v4).

## Non-Goals

- No changes to other routes (`/aichat`, `/docs`, `/chat`, `/mall`, `/blog`, `/login`).
- No changes to i18n, layout providers, or the global `globals.css` design tokens.
- No new npm dependencies.
- No new fonts, no display typography work.
- No image / asset work.

## Section Inventory (After)

| # | Section  | Component                     | Purpose                                 |
|---|----------|-------------------------------|-----------------------------------------|
| 1 | Navbar   | `navbar.tsx`                  | Logo, primary nav links, sign in, CTA   |
| 2 | Hero     | `hero-section.tsx`            | Headline, supporting copy, two CTAs     |
| 3 | Features | `features-section.tsx`        | 3×2 grid of feature cards               |
| 4 | Footer   | `footer.tsx`                  | Brand block, 3 link groups, copyright    |

## Files

### Keep and rewrite

- `src/app/[locale]/home/page.tsx`
- `src/app/[locale]/home/layout.tsx`
- `src/app/[locale]/home/_components/navbar.tsx`
- `src/app/[locale]/home/_components/hero-section.tsx`
- `src/app/[locale]/home/_components/features-section.tsx`
- `src/app/[locale]/home/_components/footer.tsx`
- `src/app/[locale]/home/_content/index.ts`
- `src/app/[locale]/home/_types/index.ts`

### Delete

- `src/app/[locale]/home/_components/showcase-section.tsx`
- `src/app/[locale]/home/_components/stats-section.tsx`
- `src/app/[locale]/home/_components/cta-section.tsx`
- `src/app/[locale]/home/_components/animate-on-scroll.tsx`
- `src/app/[locale]/home/_components/mobile-nav.tsx`

No deletion of the `_content/`, `_types/`, or `_components/` folders themselves — they remain, just slimmer.

## Component Specs

### `navbar.tsx`

- Client component (`"use client"`) because `NavigationMenu` uses state.
- Sticky top, `bg-background/80 backdrop-blur`, `border-b`.
- Single `<nav>` row, max-w-7xl, three groups:
  - Left: brand link to `/` showing `homeContent.nav.logo`.
  - Center: `NavigationMenu` with one trigger per nav link. For the scope of this refactor, use simple `NavigationMenuLink` items (no dropdown content) so we don't fabricate sub-nav structure.
  - Right: `Button variant="ghost"` for `cta` (Sign In) and a `Button` for the primary "Try AI Chat" entry-point link to `/aichat`.
- Mobile: rely on `NavigationMenu`'s built-in responsive behavior. We will not implement a separate `Sheet`-based mobile nav in this refactor. If the stock responsive menu is insufficient on small screens, that is a separate follow-up task and not part of this spec.
- `NavigationMenu` import: `@/components/ui/navigation-menu` (already installed).
- `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuLink` (each rendered as a `Link` via `asChild`).

### `hero-section.tsx`

- Server component (no client state).
- Section: `py-24 sm:py-32`.
- Container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- Inner wrapper: `mx-auto max-w-3xl text-center`.
- `Badge` for the eyebrow (variant="secondary"). The eyebrow text comes from `homeContent.hero.badge`.
- `h1`: `text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl`. Single color (`text-foreground`). No gradient, no highlighted phrase.
- `p`: `mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl`.
- CTA group: `mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row`.
  - Primary: `Button size="lg" asChild` wrapping `Link` to `primaryCTA.href`. `ArrowRight` icon with `data-icon="inline-end"`.
  - Secondary: `Button variant="outline" size="lg" asChild` wrapping `Link` to `secondaryCTA.href`. No icon.
- `Badge` import: must be added via `npx shadcn@latest add badge` (it is not currently in the installed list).
- `ArrowRight` import: `lucide-react`.

### `features-section.tsx`

- Server component.
- Section: `border-t bg-muted/30 py-24 sm:py-32`.
- Container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- Heading block: `mx-auto max-w-2xl text-center`, `h2` + `p text-muted-foreground`.
- Grid: `mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3`.
- Each card uses the full `Card` composition:
  - `Card` (no extra classes beyond defaults — uses stock `new-york` border + radius + bg).
  - `CardHeader` containing an icon `div` (`mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary`) and `CardTitle` (`text-base`).
  - `CardDescription` for body copy.
- Icons: each item in `homeContent.features.items` carries an `icon: LucideIcon` (already a component, not a string). The render reads it directly: `const Icon = item.icon; if (Icon) <Icon className="h-5 w-5" />`.
- `Card` import: `@/components/ui/card` (already installed).

### `footer.tsx`

- Server component.
- Footer element: `border-t py-12 sm:py-16`.
- Container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- Grid: `grid gap-8 sm:grid-cols-2 lg:grid-cols-4`.
  - First column: brand link (`homeContent.nav.logo`), description paragraph (`text-sm text-muted-foreground`).
  - Remaining columns: one per `data.sections` entry — `h3 text-sm font-semibold` + `ul mt-3 flex flex-col gap-2` of `Link` items (`text-sm text-muted-foreground transition-colors hover:text-foreground`).
- Bottom: `Separator` + copyright `p` centered.

## Data Shape (`_types/index.ts`)

```ts
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface HomeContent {
  seo: { title: string; description: string };
  nav: { logo: string; links: NavItem[]; cta: NavItem };
  hero: {
    badge: string;
    headline: string;
    description: string;
    primaryCTA: NavItem;
    secondaryCTA: NavItem;
  };
  features: {
    heading: string;
    description: string;
    items: FeatureItem[];
  };
  footer: {
    description: string;
    sections: FooterSection[];
    copyright: string;
  };
}
```

Removed types: `StatItem`, `CTAData`, `HeroData` (inlined into `HomeContent`), and the `highlightedText` field from hero.

## Content (`_content/index.ts`)

- Keep `seo`, `nav`, `hero`, `features`, `footer` blocks.
- Drop `showcase`, `stats`, `cta` blocks.
- `hero`: remove `highlightedText`. Keep `badge`, `headline`, `description`, `primaryCTA`, `secondaryCTA`.
- `features.items[*].icon`: change from string to a direct lucide component (e.g. `icon: Sparkles`).

## Layout and Page Wiring

`layout.tsx` is reduced to render the `Navbar` + `<main>{children}</main>`. No additional providers or wrappers.

`page.tsx` becomes a flat sequence:

```tsx
<HeroSection data={homeContent.hero} />
<FeaturesSection
  heading={homeContent.features.heading}
  description={homeContent.features.description}
  items={homeContent.features.items}
/>
<Footer data={homeContent.footer} />
```

No `AnimateOnScroll` wrappers, no section-level suspense boundaries.

## Style Discipline

- All spacing uses `flex` + `gap-*`. No `space-y-*` / `space-x-*`.
- Equal dimensions use `size-*` (e.g. `size-10` for the icon tile).
- Colors are semantic only: `bg-background`, `bg-card`, `bg-muted`, `bg-primary`, `text-foreground`, `text-muted-foreground`, `text-primary`, `border`. No raw `bg-violet-*`, no `text-emerald-*`, no `from-*/to-*` gradients.
- No `dark:` overrides — semantic tokens handle both modes.
- Icons inside `Button` use `data-icon="inline-end"` (or `inline-start`). No `size-4` / `h-4 w-4` on the icon itself.
- `cn()` for any conditional class composition (we expect to need very little).

## Accessibility

- All `Button asChild` anchors render as real links via `next/link`, so keyboard nav and screen reader semantics stay correct.
- `NavigationMenu` is the stock radix-backed primitive; it ships with proper ARIA.
- Feature cards have heading + body copy, not icon-only.
- No new ARIA needed — semantic HTML is sufficient.

## Testing

This project currently has no unit / component test harness. We will not introduce one in this refactor. Manual verification:

1. `pnpm lint` and `pnpm typecheck` (or the project's equivalent) pass.
2. `pnpm build` succeeds.
3. `pnpm dev` — load `/[locale]/` (or whatever the default locale resolves to) and visually confirm:
   - Navbar sticky, links work, mobile menu opens.
   - Hero centered, no gradient, both CTAs navigate.
   - 6 feature cards render with correct icons.
   - Footer columns and copyright render.
4. Toggle dark mode and re-verify color consistency.

## Risks and Mitigations

- **Risk:** `NavigationMenu` mobile collapse may not match what the previous `Sheet`-based mobile nav provided.
  **Mitigation:** This is accepted as a known tradeoff in favor of fewer components. Any mobile-nav improvements are deferred to a separate follow-up task.
- **Risk:** `Badge` is not currently installed in the project.
  **Mitigation:** Add it via `npx shadcn@latest add badge` before importing.
- **Risk:** Removing the `AnimateOnScroll` client component means the page is static; some users may miss the entrance animation.
  **Mitigation:** Spec explicitly trades motion for simplicity, per user direction.

## Out of Scope (Explicitly)

- Refactoring the rest of the marketing surface (other routes).
- Reworking the design system tokens in `globals.css`.
- Adding a "blocks" library preset or `npx shadcn init --preset` migration.
- Internationalization of new copy (no copy is being added; only removed).
