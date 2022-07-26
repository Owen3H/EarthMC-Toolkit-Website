const rateLimit = require('express-rate-limit')

const applyMiddleware = mw => (req, res) => new Promise((resolve, reject) => 
  mw(req, res, result => {
    result instanceof Error ? reject(result) : resolve(result)
  }))

const getIP = req =>
  req.ip || req.headers['x-real-ip'] ||
  req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress

export const getRateLimitMiddlewares = ({
  limit = 14,
  windowMs = 6 * 1000 
} = {}) => [rateLimit({ keyGenerator: getIP, windowMs, max: limit })]

const middlewares = getRateLimitMiddlewares()

async function applyRateLimit(req, res) {
  let mws = middlewares.map(applyMiddleware).map(mw => mw(req, res))
  await Promise.all(mws)
}

export default applyRateLimit