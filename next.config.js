/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  typescript: {
    // During development, you might want to set this to true temporarily
    // to identify and fix type issues, but for production builds it should be false
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;