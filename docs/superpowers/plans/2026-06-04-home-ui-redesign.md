# Home UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `src/app/[locale]/home/` from a 7-section, custom-styled landing into a 4-section, stock shadcn landing page (Navbar, Hero, Features, Footer) with semantic colors only, no custom gradients, no custom animations, and no image assets.

**Architecture:** Keep the existing `_components/` / `_content/` / `_types/` folder layout. Delete unused components, slim the data shape, and rewrite the four remaining components to use `NavigationMenu`, `Card`, `Badge`, `Separator`, and `Button` from `@/components/ui/`. The page becomes a flat sequence with no animation wrappers.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind CSS v4, shadcn/ui (`new-york` style, `radix` base, `lucide` icons), TypeScript, pnpm.

**Package manager:** pnpm (see `package.json` `packageManager` field).

**Working directory:** `C:\Personal\03Files\Personal\my-app`

**Spec:** `docs/superpowers/specs/2026-06-04-home-ui-redesign-design.md`

---

## Pre-flight: Read the Spec

Before starting any task, read `docs/superpowers/specs/2026-06-04-home-ui-redesign-design.md` end to end. Every task in this plan implements a section of that spec; do not invent scope.

---

## Task 1: Add the `badge` shadcn Component

**Files:**
- Create: `src/components/ui/badge.tsx` (via CLI)
- Modify: `components.json` (via CLI, automatic)

The hero eyebrow uses `Badge`. It is not currently installed. Install it without touching other components.

- [ ] **Step 1: Run the add command from the project root**

```bash
cd "C:\Personal\03Files\Personal\my-app"
pnpm dlx shadcn@latest add badge
```

- [ ] **Step 2: Confirm the file exists**

Run: `Test-Path "C:\Personal\03Files\Personal\my-app\src\components\ui\badge.tsx"`
Expected: `True`

- [ ] **Step 3: Confirm `Badge` is exported**

Run:
```bash
cd "C:\Personal\03Files\Personal\my-app" && Select-String -Path "src\components\ui\badge.tsx" -Pattern "^export"
```
Expected: At least one `export` line that includes `Badge`.

- [ ] **Step 4: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/components/ui/badge.tsx components.json
git commit -m "chore(shadcn): add badge component"
```

If the user has not approved committing, skip this step and leave changes staged or unstaged per their preference.

---

## Task 2: Update the Type Definitions

**Files:**
- Modify: `src/app/[locale]/home/_types/index.ts`

Drop the `HeroData`, `StatItem`, and `CTAData` exports. Change `FeatureItem.icon` from `string` to `LucideIcon`. Inline hero fields into `HomeContent`.

- [ ] **Step 1: Replace the file contents**

Open `src/app/[locale]/home/_types/index.ts` and replace its entire contents with:

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
  seo: {
    title: string;
    description: string;
  };
  nav: {
    logo: string;
    links: NavItem[];
    cta: NavItem;
  };
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

- [ ] **Step 2: Verify the file compiles in isolation**

The next tasks will import from this file. Skip an isolated type check; `pnpm build` in Task 11 will catch issues.

- [ ] **Step 3: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/app/\[locale\]/home/_types/index.ts
git commit -m "refactor(home): slim home content types"
```

---

## Task 3: Update the Content File

**Files:**
- Modify: `src/app/[locale]/home/_content/index.ts`

Drop the `showcase`, `stats`, and `cta` blocks. Drop the `highlightedText` field on `hero`. Change every `icon: "string"` in `features.items` to `icon: <LucideComponent>`.

- [ ] **Step 1: Replace the file contents**

Open `src/app/[locale]/home/_content/index.ts` and replace its entire contents with:

```ts
import {
  BookOpen,
  MessageSquare,
  PenTool,
  Shield,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import type { HomeContent } from "../_types";

export const homeContent: HomeContent = {
  seo: {
    title: "AI-Powered Platform",
    description:
      "Explore AI chat, intelligent tools, and next-generation experiences. Built with cutting-edge technology.",
  },

  nav: {
    logo: "AI-Powered Platform",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "AI Chat", href: "/aichat" },
      { label: "Chat", href: "/chat" },
      { label: "Mall", href: "/mall" },
    ],
    cta: { label: "Sign In", href: "/login" },
  },

  hero: {
    badge: "Now in Public Beta",
    headline: "Build smarter with AI-first tools.",
    description:
      "A unified platform combining intelligent chat, real-time collaboration, and curated resources — designed for the next generation of creators.",
    primaryCTA: { label: "Get Started", href: "/aichat" },
    secondaryCTA: { label: "View Docs", href: "/docs" },
  },

  features: {
    heading: "Everything you need, nothing you don't",
    description:
      "Powerful features crafted with precision. Each tool is designed to integrate seamlessly into your workflow.",
    items: [
      {
        icon: Sparkles,
        title: "AI Chat",
        description:
          "Conversational AI that understands context, writes code, and helps you think through complex problems.",
      },
      {
        icon: MessageSquare,
        title: "Real-time Chat",
        description:
          "Instant messaging with low-latency connections. Connect with your team or community effortlessly.",
      },
      {
        icon: ShoppingBag,
        title: "Digital Mall",
        description:
          "Browse and access curated digital products, tools, and resources in one centralized marketplace.",
      },
      {
        icon: BookOpen,
        title: "Documentation",
        description:
          "Comprehensive, always up-to-date docs that help you ship faster with clear guides and references.",
      },
      {
        icon: PenTool,
        title: "Blog & Insights",
        description:
          "In-depth articles on AI, engineering, and product design. Stay ahead with thoughtful analysis.",
      },
      {
        icon: Shield,
        title: "Secure by Default",
        description:
          "Enterprise-grade security with encrypted connections, authentication, and data protection built in.",
      },
    ],
  },

  footer: {
    description: "AI-powered platform for the next generation of creators.",
    sections: [
      {
        title: "Product",
        links: [
          { label: "AI Chat", href: "/aichat" },
          { label: "Chat", href: "/chat" },
          { label: "Mall", href: "/mall" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Docs", href: "/docs" },
          { label: "Blog", href: "/blog" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} AI-Powered Platform. All rights reserved.`,
  },
};
```

- [ ] **Step 2: Sanity-check the import block**

Confirm that each of `Sparkles`, `MessageSquare`, `ShoppingBag`, `BookOpen`, `PenTool`, `Shield` is used exactly once as `icon: <Name>` in the `features.items` array. No unused imports.

- [ ] **Step 3: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/app/\[locale\]/home/_content/index.ts
git commit -m "refactor(home): slim home content (drop showcase/stats/cta)"
```

---

## Task 4: Rewrite the Navbar

**Files:**
- Modify: `src/app/[locale]/home/_components/navbar.tsx`

Use `NavigationMenu` for the center links. Drop the custom mobile nav — the stock `NavigationMenu` ships with a responsive layout; we accept that behavior. The "Try AI Chat" button stays as a stock `Button asChild` wrapping a `next/link`.

- [ ] **Step 1: Replace the file contents**

Open `src/app/[locale]/home/_components/navbar.tsx` and replace its entire contents with:

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { NavItem } from "../_types";

interface NavbarProps {
  logo: string;
  links: NavItem[];
  cta: NavItem;
}

export function Navbar({ logo, links, cta }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold tracking-tight">
          {logo}
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/aichat">Try AI Chat</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Confirm imports resolve**

Visual check that all five imports come from already-installed paths:
- `@/components/ui/button` — already present.
- `@/components/ui/navigation-menu` — already present.
- `next/link` — built-in to Next.js.
- `../_types` — local.

- [ ] **Step 3: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/app/\[locale\]/home/_components/navbar.tsx
git commit -m "refactor(home): rewrite navbar with NavigationMenu"
```

---

## Task 5: Rewrite the Hero Section

**Files:**
- Modify: `src/app/[locale]/home/_components/hero-section.tsx`

Single-color headline (no gradient), `Badge` eyebrow, two `Button` CTAs. The primary button uses `data-icon="inline-end"` on the `ArrowRight` icon per shadcn rules (no `size-4`).

- [ ] **Step 1: Replace the file contents**

Open `src/app/[locale]/home/_components/hero-section.tsx` and replace its entire contents with:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NavItem } from "../_types";

interface HeroData {
  badge: string;
  headline: string;
  description: string;
  primaryCTA: NavItem;
  secondaryCTA: NavItem;
}

interface HeroSectionProps {
  data: HeroData;
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="secondary">{data.badge}</Badge>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
            {data.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {data.description}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={data.primaryCTA.href}>
                {data.primaryCTA.label}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={data.secondaryCTA.href}>
                {data.secondaryCTA.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Note the local `HeroData` type**

`HeroData` is intentionally declared locally in this file rather than imported from `_types`. The `HomeContent.hero` shape is structurally identical, so consumers of the section get a self-describing prop type without crossing module boundaries for a single use. Keep it as-is.

- [ ] **Step 3: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/app/\[locale\]/home/_components/hero-section.tsx
git commit -m "refactor(home): rewrite hero with Badge + Button (no gradient)"
```

---

## Task 6: Rewrite the Features Section

**Files:**
- Modify: `src/app/[locale]/home/_components/features-section.tsx`

Use the full `Card` composition: `Card` → `CardHeader` (icon + `CardTitle`) → `CardDescription`. The `icon` field on each `FeatureItem` is now a `LucideIcon` (component), read directly with `const Icon = item.icon`.

- [ ] **Step 1: Replace the file contents**

Open `src/app/[locale]/home/_components/features-section.tsx` and replace its entire contents with:

```tsx
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FeatureItem } from "../_types";

interface FeaturesSectionProps {
  heading: string;
  description: string;
  items: FeatureItem[];
}

export function FeaturesSection({
  heading,
  description,
  items,
}: FeaturesSectionProps) {
  return (
    <section className="border-t bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon />
                  </div>
                  <CardTitle className="text-base">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Confirm the icon is rendered correctly**

`<Icon />` is invoked without `className`. The `Button`-equivalent parent (`<div>`) has no icon-shrinking styles; the icon renders at the default lucide size, which is fine inside a 40px rounded tile. If the icon visually overflows, fall back to wrapping with `<span className="[&_svg]:size-5"><Icon /></span>` (one-line adjustment, no API change).

- [ ] **Step 3: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/app/\[locale\]/home/_components/features-section.tsx
git commit -m "refactor(home): rewrite features section with Card"
```

---

## Task 7: Rewrite the Footer

**Files:**
- Modify: `src/app/[locale]/home/_components/footer.tsx`

Use `Separator` between the link grid and the copyright. The brand name comes from `homeContent.nav.logo` (the parent passes it; the section signature accepts a `brand: string` prop). Update the parent call site in `layout.tsx` to pass it.

- [ ] **Step 1: Replace the file contents**

Open `src/app/[locale]/home/_components/footer.tsx` and replace its entire contents with:

```tsx
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type { FooterData } from "../_types";

interface FooterProps {
  brand: string;
  data: FooterData;
}

export function Footer({ brand, data }: FooterProps) {
  return (
    <footer className="border-t py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-base font-semibold tracking-tight">
              {brand}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {data.description}
            </p>
          </div>

          {data.sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          {data.copyright}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/app/\[locale\]/home/_components/footer.tsx
git commit -m "refactor(home): rewrite footer with Separator + brand prop"
```

---

## Task 8: Update the Home Layout

**Files:**
- Modify: `src/app/[locale]/home/layout.tsx`

The footer now expects a `brand` prop. Pass `homeContent.nav.logo`.

- [ ] **Step 1: Replace the file contents**

Open `src/app/[locale]/home/layout.tsx` and replace its entire contents with:

```tsx
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import { homeContent } from "./_content";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar
        logo={homeContent.nav.logo}
        links={homeContent.nav.links}
        cta={homeContent.nav.cta}
      />
      <main className="min-h-screen">{children}</main>
      <Footer brand={homeContent.nav.logo} data={homeContent.footer} />
    </>
  );
}
```

Note: the `Footer` is now rendered in the layout, not the page. This is intentional — the footer is present chrome, not page content. The page in Task 9 no longer renders `<Footer>`.

- [ ] **Step 2: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/app/\[locale\]/home/layout.tsx
git commit -m "refactor(home): move footer into layout"
```

---

## Task 9: Update the Home Page

**Files:**
- Modify: `src/app/[locale]/home/page.tsx`

Drop the `Footer`, `AnimateOnScroll`, and unused section imports. Render only `HeroSection` and `FeaturesSection`.

- [ ] **Step 1: Replace the file contents**

Open `src/app/[locale]/home/page.tsx` and replace its entire contents with:

```tsx
import type { Metadata } from "next";
import { homeContent } from "./_content";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";

export const metadata: Metadata = {
  title: homeContent.seo.title,
  description: homeContent.seo.description,
};

export default function HomePage() {
  return (
    <>
      <HeroSection data={homeContent.hero} />
      <FeaturesSection
        heading={homeContent.features.heading}
        description={homeContent.features.description}
        items={homeContent.features.items}
      />
    </>
  );
}
```

- [ ] **Step 2: Confirm no `AnimateOnScroll` references remain**

Run:
```bash
cd "C:\Personal\03Files\Personal\my-app" && Select-String -Path "src\app\[locale]\home\page.tsx","src\app\[locale]\home\layout.tsx" -Pattern "AnimateOnScroll"
```
Expected: no output (empty result).

- [ ] **Step 3: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add src/app/\[locale\]/home/page.tsx
git commit -m "refactor(home): simplify page to Hero + Features"
```

---

## Task 10: Delete Unused Component Files

**Files:**
- Delete: `src/app/[locale]/home/_components/showcase-section.tsx`
- Delete: `src/app/[locale]/home/_components/stats-section.tsx`
- Delete: `src/app/[locale]/home/_components/cta-section.tsx`
- Delete: `src/app/[locale]/home/_components/animate-on-scroll.tsx`
- Delete: `src/app/[locale]/home/_components/mobile-nav.tsx`

These are no longer imported anywhere. The next task's build will fail if a stray import survives.

- [ ] **Step 1: Confirm no remaining references**

Run:
```bash
cd "C:\Personal\03Files\Personal\my-app" && Select-String -Path "src\app\[locale]\home" -Pattern "showcase-section|stats-section|cta-section|animate-on-scroll|mobile-nav" -Recurse
```
Expected: no matches inside `src/app/[locale]/home/`. (Outside that folder, e.g. the plan and spec documents, may legitimately mention these names; ignore those.)

- [ ] **Step 2: Delete the five files**

```bash
cd "C:\Personal\03Files\Personal\my-app"
Remove-Item "src\app\[locale]\home\_components\showcase-section.tsx"
Remove-Item "src\app\[locale]\home\_components\stats-section.tsx"
Remove-Item "src\app\[locale]\home\_components\cta-section.tsx"
Remove-Item "src\app\[locale]\home\_components\animate-on-scroll.tsx"
Remove-Item "src\app\[locale]\home\_components\mobile-nav.tsx"
```

- [ ] **Step 3: Confirm the components folder contains exactly 4 files**

Run: `Get-ChildItem "C:\Personal\03Files\Personal\my-app\src\app\[locale]\home\_components"`
Expected: `footer.tsx`, `hero-section.tsx`, `features-section.tsx`, `navbar.tsx`.

- [ ] **Step 4: Commit (only if the user has approved committing)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
git add -u "src/app/[locale]/home/_components/"
git commit -m "refactor(home): remove unused section components"
```

---

## Task 11: Verify the Build and Lint

This task is the gate before declaring the refactor done. Do not skip.

- [ ] **Step 1: Run lint**

```bash
cd "C:\Personal\03Files\Personal\my-app"
pnpm lint
```

Expected: command exits 0. If ESLint reports errors, fix them in the relevant file and re-run. Do not disable rules.

- [ ] **Step 2: Run the production build (TypeScript included)**

```bash
cd "C:\Personal\03Files\Personal\my-app"
pnpm build
```

Expected: command exits 0. `next build` runs the TypeScript compiler and reports type errors. Address any reported error at its source.

- [ ] **Step 3: Smoke test the dev server**

```bash
cd "C:\Personal\03Files\Personal\my-app"
pnpm dev
```

In a separate terminal, fetch the home route (port 7000 is configured for this project):

```bash
curl -s -o $null -w "%{http_code}" http://localhost:7000/
```

Expected: `200`.

Stop the dev server with `Ctrl+C`.

- [ ] **Step 4: Manual visual verification checklist**

Open `http://localhost:7000/` in a browser and confirm:

- [ ] Sticky navbar shows brand, link list, "Sign In" ghost button, "Try AI Chat" primary button.
- [ ] On a viewport ≤ 768px, the link list collapses (acceptable: `NavigationMenu` hides via `md:flex` and the right-side buttons remain visible).
- [ ] Hero shows badge eyebrow, single-color headline, description, two CTAs side-by-side on desktop / stacked on mobile.
- [ ] Features section shows a 3×2 grid on desktop (1 col on mobile, 2 col on `sm`).
- [ ] Each feature card has a colored icon tile + title + description.
- [ ] Footer has a 4-column grid on desktop, brand column first, three link columns, separator, centered copyright.
- [ ] Toggle dark mode (the project already supports it via `next-themes`) — no contrast issues, no leftover purple gradient text.

If any check fails, fix the relevant component, re-run lint + build, and re-verify.

- [ ] **Step 5: Final commit (only if the user has approved committing)**

If Steps 1–4 required any fix commits, this is the natural end. If you made fix commits during verification, list them with `git log --oneline -10` and confirm each has a clear message. Otherwise, no final commit is needed.

---

## Self-Review Notes (already applied)

- Spec coverage: every section in `2026-06-04-home-ui-redesign-design.md` is implemented (4 sections, 2 type/content rewrites, layout + page wiring, deletions, verification).
- Type consistency: `LucideIcon` is defined in Task 2, used in Task 3 content, consumed in Task 6 component. `HeroData` is a local-only type in Task 5 to avoid coupling. `FooterProps.brand` is introduced in Task 7 and threaded through in Task 8.
- No placeholders. All code blocks are complete and copy-pasteable. No "TBD" or "implement later" steps.
