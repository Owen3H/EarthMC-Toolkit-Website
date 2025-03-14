import { getServerInfo, endpoint } from 'earthmc'

import rateLimit from './rate-limit.ts'
const limiter = rateLimit({ interval: 7 * 1000 })

const getIP = req =>
    req.ip || req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress

async function getData(query) {
    const [type, ts] = query.params
    const map = query.map

    switch(type.toLowerCase()) {
        case 'serverinfo': return await getServerInfo()
        case 'archive': {
            endpoint.useArchive(ts)
            return await endpoint.mapData(map).then(data => { 
                endpoint.useArchive(false)
                return data
            })
        }
        default: return null
    }
}

async function serve(req, res) {
    try { await limiter.check(res, 5, getIP(req)) } 
    catch { return res.status(429).json({ error: 'Rate limit exceeded' }) }

    const out = await getData(req.query)   
    if (!out) return res.status(400).send(`Parameter ${req.query.params[0]} not recognized.`)

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Accept-Encoding', 'br, gzip')
    res.setHeader('Cache-Control', `s-maxage=1, stale-while-revalidate=5`)   
    
    return res.status(200).json(out)
}

export default serve