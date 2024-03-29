const auroraHeaders = [{
    source: "/api/aurora/towns",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  },
  {
    source: "/api/aurora/towns/:townName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  },
  {
    source: "/api/aurora/nations",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  },
  {
    source: "/api/aurora/nations/:nationName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  }, 
  {
    source: "/api/aurora/news",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=300, stale-while-revalidate=300"}]
  },
  {
    source: "/api/aurora/alliances",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=170, stale-while-revalidate=170"}]
  },
  {
    source: "/api/aurora/alliances/:allianceName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=170, stale-while-revalidate=170"}]
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
      value: "s-maxage=300, stale-while-revalidate=1200"}]
  },
  {
    source: "/api/aurora/nearby/players/:inputs*",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=2, stale-while-revalidate=30"}]
  },
  {
    source: "/api/aurora/onlineplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=4, stale-while-revalidate=6"}]
  },
  {
    source: "/api/aurora/onlineplayers/:playerName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=3, stale-while-revalidate=10"}]
  },
  {
    source: "/api/aurora/townless",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=15, stale-while-revalidate=60"}]
  },
  {
    source: "/api/aurora/townlessplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=15, stale-while-revalidate=60"}]
  },
  {
    source: "/api/aurora/residents",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  },
  {
    source: "/api/aurora/residents/:residentName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  }
]

const novaHeaders = [{
  source: "/api/nova/towns",
  headers: [{
    key: "Cache-Control",
    value: "s-maxage=180, stale-while-revalidate=180"}]
  },
  {
    source: "/api/nova/towns/:townName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  },
  {
    source: "/api/nova/residents",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  },  
  {
    source: "/api/nova/townless",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=30, stale-while-revalidate=90"}]
  },  
  {
    source: "/api/nova/townlessplayers",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=30, stale-while-revalidate=90"}]
  },
  {
    source: "/api/nova/nearby/towns/:inputs*",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=300, stale-while-revalidate=1200"}]
  },
  {
    source: "/api/nova/nearby/nations/:inputs*",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=300, stale-while-revalidate=1200"}]
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
      value: "s-maxage=4, stale-while-revalidate=8"}]
  },
  {
    source: "/api/nova/onlineplayers/:playerName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=4, stale-while-revalidate=8"}]
  },
  {
    source: "/api/nova/nations",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  },
  {
    source: "/api/nova/nations/:nationName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=180, stale-while-revalidate=180"}]
  },
  {
    source: "/api/nova/news",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=300, stale-while-revalidate=300"}]
  },
  {
    source: "/api/nova/alliances",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=170, stale-while-revalidate=170"}]
  },
  {
    source: "/api/nova/alliances/:allianceName",
    headers: [{
      key: "Cache-Control",
      value: "s-maxage=170, stale-while-revalidate=170"}]
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