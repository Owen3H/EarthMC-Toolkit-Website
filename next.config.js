/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [{
      source: "/api/aurora/towns",
      headers: [{
        key: "Cache-Control",
        value: "s-maxage=30, stale-while-revalidate=60",
      }]
    }]
  }
}

module.exports = nextConfig