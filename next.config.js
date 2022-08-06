/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [cors('GET, POST, PUT, OPTIONS')]
  }
}

const cors = methods => ({
  source: '/api/:path*',
  headers: [
    { key: "Access-Control-Allow-Credentials", value: "true" },
    { key: "Access-Control-Allow-Origin", value: "*" },
    { key: "Access-Control-Allow-Methods", value: methods },
    { key: "Access-Control-Allow-Headers", value: "authorization, X-Requested-With, Accept, Content-Length, Content-MD5, Content-Type"
  }]
})

module.exports = nextConfig