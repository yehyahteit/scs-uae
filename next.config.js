/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static caching — all pages fetch fresh data on every request
  // This ensures admin changes appear on the website immediately
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
