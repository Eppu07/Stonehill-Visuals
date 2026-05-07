/** @type {import('next').NextConfig} */
// DEPLOY_TARGET=github-pages -> staattinen vienti basePathilla
// muut (Vercel, paikallinen dev) -> normaali Next.js, image-optimointi päällä
const isPages = process.env.DEPLOY_TARGET === 'github-pages';
const repo = 'Stonehill.architect';

const baseConfig = {
  reactStrictMode: true,
  images: isPages
    ? { unoptimized: true }
    : {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [360, 640, 828, 1080, 1280, 1600, 1920],
        imageSizes: [200, 320, 480, 640, 800],
        minimumCacheTTL: 60 * 60 * 24 * 30
      }
};

const nextConfig = isPages
  ? {
      ...baseConfig,
      output: 'export',
      trailingSlash: true,
      basePath: `/${repo}`,
      assetPrefix: `/${repo}/`
    }
  : baseConfig;

export default nextConfig;
