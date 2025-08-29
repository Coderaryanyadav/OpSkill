import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: process.env.NODE_ENV === 'production',
  // Disable Turbopack for now
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3']
  },
  // Enable server actions
  serverActions: {
    bodySizeLimit: '2mb'
  },
  // Configure images
  images: {
    domains: ['localhost', 'opskill.vercel.app'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://opskill.vercel.app',
  },
  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include better-sqlite3 in client-side bundles
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  // Enable static HTML export if needed
  // output: 'export',
};

export default nextConfig;
