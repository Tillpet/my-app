export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface CTAData {
  headline: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
}

export interface HeroData {
  badge: string;
  headline: string;
  highlightedText: string;
  description: string;
  primaryCTA: NavItem;
  secondaryCTA: NavItem;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface FooterData {
  description: string;
  sections: FooterSection[];
  copyright: string;
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
  hero: HeroData;
  features: {
    heading: string;
    description: string;
    items: FeatureItem[];
  };
  showcase: {
    heading: string;
    description: string;
    imageAlt: string;
  };
  stats: StatItem[];
  cta: CTAData;
  footer: FooterData;
}
