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

export type FooterData = HomeContent["footer"];
