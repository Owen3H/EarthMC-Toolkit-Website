const emc = require('earthmc'),
      rateLimit = require('./rate-limit.ts').default,
      limiter = rateLimit({ interval: 4 * 1000 })

const getIP = req =>
    req.ip || req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress

async function getData(query) {
    console.log(req.query)
    let { params, ts, url } = query

    switch(params[0].toLowerCase()) {
        case 'serverinfo': return await emc.getServerInfo()
        case 'archive': return await emc.endpoint.getArchive(url, ts)
        default: return null
    }
}

async function serve(req, res) {
    try { await limiter.check(res, 6, getIP(req)) } 
    catch { return res.status(429).json({ error: 'Rate limit exceeded' }) }

    let out = await getData(req.query)   
    if (!out) return res.status(400).send(`Parameter ${req.query.params[0]} not recognized.`)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Accept-Encoding', 'br, gzip')
    res.setHeader('Cache-Control', `s-maxage=1, stale-while-revalidate=4`)   
    
    res.status(200).json(out)
}

export default serve