import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ponytail: allow LAN access in dev; remove/restrict in production if needed
  allowedDevOrigins: ["192.168.1.32", "localhost"],
};

export default nextConfig;
