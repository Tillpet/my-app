import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HeroData } from "../_types";

interface HeroSectionProps {
  data: HeroData;
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent_50%,rgba(0,0,0,0.02)_50%)] bg-[length:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_40%,transparent_100%)]" />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mb-6 inline-flex animate-fade-in items-center rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
          >
            {data.badge}
          </div>

          <h1
            className="animate-fade-in text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
          >
            {data.headline}{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              {data.highlightedText}
            </span>
          </h1>

          <p
            className="animate-fade-in mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            {data.description}
          </p>

          <div
            className="animate-fade-in mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
          >
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href={data.primaryCTA.href}>
                {data.primaryCTA.label}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
              asChild
            >
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
