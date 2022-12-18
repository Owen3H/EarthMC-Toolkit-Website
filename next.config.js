const auroraHeaders = [{
    source: "/api/aurora/towns",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  },
  {
    source: "/api/aurora/towns/:townName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  },
  {
    source: "/api/aurora/nations",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  },
  {
    source: "/api/aurora/nations/:nationName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  }, 
  {
    source: "/api/aurora/news",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=20, stale-while-revalidate=60"}]
  },
  {
    source: "/api/aurora/alliances",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=150, stale-while-revalidate=300"}]
  },
  {
    source: "/api/aurora/alliances/:allianceName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=150, stale-while-revalidate=300"}]
  },
  {
    source: "/api/aurora/allplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=150, stale-while-revalidate=300"}]
  },
  {
    source: "/api/aurora/allplayers/:playerName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=150, stale-while-revalidate=300"}]
  },
  {
    source: "/api/aurora/nearby/towns/:inputs*",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=300, stale-while-revalidate=1200"}]
  },
  {
    source: "/api/aurora/nearby/nations/:inputs*",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=600, stale-while-revalidate=1800"}]
  },
  {
    source: "/api/aurora/nearby/players/:inputs*",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=2, stale-while-revalidate=15"}]
  },
  {
    source: "/api/aurora/onlineplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=3, stale-while-revalidate=6"}]
  },
  {
    source: "/api/aurora/onlineplayers/:playerName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=3, stale-while-revalidate=6"}]
  },
  {
    source: "/api/aurora/townless",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=10, stale-while-revalidate=60"}]
  },  
  {
    source: "/api/aurora/townlessplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=10, stale-while-revalidate=60"}]
  },
  {
    source: "/api/aurora/residents",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  },
  {
    source: "/api/aurora/residents/:residentName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  }
]

const novaHeaders = [{
  source: "/api/nova/towns",
  headers: [{
    key: "Cache-Control",
    value: "s-maxage=120, stale-while-revalidate=180"}]
  },
  {
    source: "/api/nova/towns/:townName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  },
  {
    source: "/api/nova/residents",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  },  
  {
    source: "/api/nova/townless",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=10, stale-while-revalidate=60"}]
  },  
  {
    source: "/api/nova/townlessplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=10, stale-while-revalidate=60"}]
  },
  {
    source: "/api/nova/nearby/players/:inputs*",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=2, stale-while-revalidate=15"}]
  },
  {
    source: "/api/nova/onlineplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=3, stale-while-revalidate=6"}]
  },
  {
    source: "/api/nova/onlineplayers/:playerName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=3, stale-while-revalidate=6"}]
  },
  {
    source: "/api/nova/nations",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  },
  {
    source: "/api/nova/nations/:nationName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=120, stale-while-revalidate=180"}]
  }, 
  {
    source: "/api/nova/news",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=20, stale-while-revalidate=60"}]
  },
  {
    source: "/api/nova/alliances",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=150, stale-while-revalidate=300"}]
  },
  {
    source: "/api/nova/alliances/:allianceName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=150, stale-while-revalidate=300"}]
  },
  {
    source: "/api/nova/allplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=150, stale-while-revalidate=300"}]
  },
  {
    source: "/api/nova/allplayers/:playerName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=150, stale-while-revalidate=300"}]
  }
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [...auroraHeaders, ...novaHeaders]
  }
}

module.exports = nextConfig