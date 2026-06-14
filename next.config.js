/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip type checking and linting during build (handled locally)
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Disable static caching — all pages fetch fresh data on every request
  experimental: {
    fetchCache: 'force-no-store',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
