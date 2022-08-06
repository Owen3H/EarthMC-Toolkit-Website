/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true }
}

module.exports = nextConfig