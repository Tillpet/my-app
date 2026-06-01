import {
  Sparkles,
  MessageSquare,
  ShoppingBag,
  BookOpen,
  PenTool,
  Shield,
} from "lucide-react";
import { AnimateOnScroll } from "./animate-on-scroll";
import type { FeatureItem } from "../_types";

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  sparkles: Sparkles,
  "message-square": MessageSquare,
  "shopping-bag": ShoppingBag,
  "book-open": BookOpen,
  "pen-tool": PenTool,
  shield: Shield,
};

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
          {items.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <AnimateOnScroll key={feature.title} delay={i * 80}>
                <div className="group h-full rounded-xl border bg-card p-6 transition-all duration-300 hover:border-foreground/10 hover:shadow-md">
                  {Icon && (
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
