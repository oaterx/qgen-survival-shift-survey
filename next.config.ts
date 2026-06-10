import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: process.env.NODE_ENV === "production" ? ".next" : "/tmp/qgen-survival-next",
};

export default nextConfig;
