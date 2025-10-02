import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: '/nyc-parks-schedule-src',
  basePath: '/nyc-parks-schedule',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
