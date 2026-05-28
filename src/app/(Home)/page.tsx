import type { Metadata } from "next";
import { homeContent } from "./_content";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { ShowcaseSection } from "./_components/showcase-section";
import { StatsSection } from "./_components/stats-section";
import { CTASection } from "./_components/cta-section";
import { Footer } from "./_components/footer";
import { AnimateOnScroll } from "./_components/animate-on-scroll";

export const metadata: Metadata = {
  title: homeContent.seo.title,
  description: homeContent.seo.description,
};

export default function HomePage() {
  return (
    <>
      <HeroSection data={homeContent.hero} />
      <AnimateOnScroll>
        <FeaturesSection
          heading={homeContent.features.heading}
          description={homeContent.features.description}
          items={homeContent.features.items}
        />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <ShowcaseSection
          heading={homeContent.showcase.heading}
          description={homeContent.showcase.description}
          imageAlt={homeContent.showcase.imageAlt}
        />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <StatsSection stats={homeContent.stats} />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <CTASection data={homeContent.cta} />
      </AnimateOnScroll>
      <Footer data={homeContent.footer} />
    </>
  );
}
