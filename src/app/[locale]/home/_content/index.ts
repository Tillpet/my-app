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
