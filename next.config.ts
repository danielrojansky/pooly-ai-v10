import type { NextConfig } from "next";
import path from "node:path";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  env: {
    // Baked in at build time — available as process.env.NEXT_PUBLIC_APP_VERSION
    // everywhere (server components, client components, API routes).
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
};

export default nextConfig;
