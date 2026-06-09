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
