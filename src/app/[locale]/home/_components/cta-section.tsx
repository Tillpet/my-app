import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CTAData } from "../_types";

interface CTASectionProps {
  data: CTAData;
}

export function CTASection({ data }: CTASectionProps) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center shadow-sm sm:px-16 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(120,119,198,0.08),transparent)]" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {data.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            {data.description}
          </p>
          <div className="mt-8">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href={data.primaryHref}>
                {data.primaryLabel}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
