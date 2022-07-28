const emc = require('earthmc'),
      rateLimit = require('./rate-limit'),
      limiter = rateLimit({ interval: 6 * 1000 })

async function getData(param) {
    switch(param) {
        case 'serverinfo': return await emc.getServerInfo()
        default: return null
    }
}

async function serve(req, res) {
    try { await limiter.check(res, 14, 'CACHE_TOKEN') } 
    catch { res.status(429).json({ error: 'Rate limit exceeded' }) }

    let { param } = req.query, out = await getData(param)   
    if (!out) return res.status(400).send(`Parameter ${param} not recognized.`)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Accept-Encoding', 'br')
    res.setHeader('Cache-Control', `s-maxage=5, stale-while-revalidate=15`)   
    
    res.status(200).json(out)
}

export default serve