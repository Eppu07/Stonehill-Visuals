/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repo = 'Stonehill.architect';

const nextConfig = {
  reactStrictMode: true,
  // Tuottaa staattisen sivuston `out/`-kansioon — toimii GitHub Pagesissa
  output: 'export',
  trailingSlash: true,
  // Project Pages servaa /Stonehill.architect/-alipolun alta
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  // GitHub Pages ei tue Next.js:n image-optimointia, joten servoidaan kuvat sellaisenaan
  images: { unoptimized: true }
};

export default nextConfig;
