import {
  BookOpen,
  MessageSquare,
  PenTool,
  Shield,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
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
];

export function FeaturesSection() {
  return (
    <section className="border-t bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features crafted with precision. Each tool is designed to
            integrate seamlessly into your workflow.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
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
