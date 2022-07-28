const rateLimit = require('express-rate-limit')

const applyMw = mw => (req, res) => new Promise((resolve, reject) => 
  mw(req, res, result => {
    result instanceof Error ? reject(result) : resolve(result)
  }))

const getIP = req =>
  req.ip || req.headers['x-real-ip'] ||
  req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress

export const middlewares = ({ limit = 14, windowMs = 6 * 1000 } = {}) => [
  rateLimit({ keyGenerator: getIP, windowMs, max: limit })
]

async function applyRateLimit(req, res) {
  console.log("Applying rate limit..")

  let mws = middlewares().map(applyMw).map(mw => mw(req, res)),
      all = await Promise.all(mws)

  console.log(all)
  return all
}

export default applyRateLimit