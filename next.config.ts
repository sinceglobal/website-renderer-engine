import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server (.next/standalone/server.js) for a small
  // production Docker image. See Dockerfile.
  output: "standalone",
  transpilePackages: ["@sinceglobal/website-builder-base"],
};

export default nextConfig;
