import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',      // static site
  trailingSlash: true,
  images: {
    unoptimized: true,   // required for S3
  },
};

export default nextConfig;
