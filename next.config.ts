import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // 90 is used for the gallery photos so faces stay sharp.
    qualities: [75, 90],
  },
};

export default nextConfig;
