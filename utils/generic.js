const emc = require('earthmc'),
      rateLimit = require('./rate-limit.ts').default,
      limiter = rateLimit({ interval: 4 * 1000 })

const getIP = req =>
    req.ip || req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress

async function getData(params) {
    let [dataType, url, ts] = params

    switch(dataType) {
        case 'serverinfo': return await emc.getServerInfo()
        case 'archive': return await emc.endpoint.getArchive(url, ts)
        default: return null
    }
}

async function serve(req, res) {
    try { await limiter.check(res, 6, getIP(req)) } 
    catch { return res.status(429).json({ error: 'Rate limit exceeded' }) }

    let { params } = req.query
    
    let out = await getData(params)   
    if (!out) return res.status(400).send(`Parameter ${params[0]} not recognized.`)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Accept-Encoding', 'br, gzip')
    res.setHeader('Cache-Control', `s-maxage=1, stale-while-revalidate=4`)   
    
    res.status(200).json(out)
}

export default serve