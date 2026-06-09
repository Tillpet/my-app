import type { Metadata } from "next";
import { homeContent } from "./_content";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";

export const metadata: Metadata = {
  title: homeContent.seo.title,
  description: homeContent.seo.description,
};

export default function HomePage() {
  return (
    <>
      <HeroSection data={homeContent.hero} />
      <FeaturesSection
        heading={homeContent.features.heading}
        description={homeContent.features.description}
        items={homeContent.features.items}
      />
    </>
  );
}
