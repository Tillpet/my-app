import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    // DATABASE_URL: process.env.DIRECT_URL,
  },
};

export default nextConfig;