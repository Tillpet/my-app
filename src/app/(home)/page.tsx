import type { Metadata } from "next";
import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";

export const metadata: Metadata = {
  title: "AI-Powered Platform",
  description:
    "Explore AI chat, intelligent tools, and next-generation experiences. Built with cutting-edge technology.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}