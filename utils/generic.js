const emc = require('earthmc'),
      applyRateLimit = require('./rate-limit').default

async function getData(param) {
    switch(param) {
        case 'serverinfo': return await emc.getServerInfo()
        default: return null
    }
}

async function serve(req, res) {
    try { await applyRateLimit(req, res) }
    catch { return res.status(429).send('Too many requests') }

    let { param } = req.query, out = await getData(param)   
    if (!out) return res.status(400).send(`Parameter ${param} not recognized.`)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Accept-Encoding', 'br')
    res.setHeader('Cache-Control', `s-maxage=5, stale-while-revalidate=15`)   
    
    res.status(200).json(out)
}

export default serve