import withBundleAnalyzer from "@next/bundle-analyzer";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

// TODO cache-control headers don't work for static files
/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINTER === "true",
  },
};

export default function config(phase) {
  if (
    phase === PHASE_DEVELOPMENT_SERVER &&
    process.env.DISABLE_CF_DEV !== "true"
  ) {
    initOpenNextCloudflareForDev();
  }

  return process.env.ANALYZE === "true"
    ? withBundleAnalyzer()(nextConfig)
    : nextConfig;
}
