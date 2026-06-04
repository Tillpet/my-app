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
