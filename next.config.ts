import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  // Required when opening the dev server from a phone via LAN IP.
  // This is not API CORS — it only allows Next.js dev assets to load on your device.
  allowedDevOrigins: ["192.168.100.17"],
};

export default nextConfig;
