import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'eu-images.contentstack.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.contentstack.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    // Enable Server Actions if needed
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Empty turbopack config to acknowledge we're using Turbopack
  turbopack: {},
};

export default nextConfig;
