const auroraHeaders = [{
  source: "/api/aurora/news",
  headers: [{
    key: "Cache-Control",
    value: "s-maxage=300, stale-while-revalidate=300"
  }]
}, {
  source: "/api/aurora/alliances",
  headers: [{
    key: "Cache-Control",
    value: "s-maxage=170, stale-while-revalidate=170"
  }]
}, {
  source: "/api/aurora/alliances/:allianceName",
  headers: [{
    key: "Cache-Control",
    value: "s-maxage=170, stale-while-revalidate=170"
  }]
}]

const novaHeaders = [{
  source: "/api/nova/news",
  headers: [{
    key: "Cache-Control",
    value: "s-maxage=300, stale-while-revalidate=300"
  }]
}, {
  source: "/api/nova/alliances",
  headers: [{
    key: "Cache-Control",
    value: "s-maxage=31536000"
  }]
}, {
  source: "/api/nova/alliances/:allianceName",
  headers: [{
    key: "Cache-Control",
    value: "s-maxage=31536000"
  }]
}]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [...auroraHeaders, ...novaHeaders]
  }
}

export default nextConfig