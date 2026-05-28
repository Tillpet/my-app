import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import type { NavItem } from "../_types";

interface NavbarProps {
  logo: string;
  links: NavItem[];
  cta: NavItem;
}

export function Navbar({ logo, links, cta }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {logo}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/aichat">Try AI Chat</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <MobileNav logo={logo} links={links} cta={cta} />
        </div>
      </nav>
    </header>
  );
}
