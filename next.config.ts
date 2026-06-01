import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default withNextIntl(nextConfig);
