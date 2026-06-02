import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./cosmic-dashboard.css";

const cosmicDisplay = Space_Grotesk({
  variable: "--font-cosmic-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cosmic Mission Control",
  description: "Futuristic mission control dashboard with a celestial theme.",
};

export default function CosmicDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="cosmic"
      className={`${cosmicDisplay.variable} font-[family-name:var(--font-cosmic-display)]`}
      style={{
        ["--font-cosmic-display" as string]: `var(--font-cosmic-display)`,
      }}
    >
      {children}
    </div>
  );
}
