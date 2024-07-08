import { Aurora, Nova } from "earthmc"
import cache from "memory-cache"

import rateLimit from './rate-limit.ts'
const limiter = rateLimit({ interval: 10 * 1000 })

var args = []
const arg = index => args[index]?.toLowerCase() ?? null


const getIP = req =>
    req.ip || req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress

async function serve(req, res, mapName = 'aurora') {
    try { await limiter.check(res, 15, getIP(req)) } 
    catch { return res.status(429).json({ error: 'Rate limit exceeded' }) }

    const map = mapName == 'nova' ? Nova : Aurora
    const { method, query } = req
    const { params } = query
    
    console.log(`${method} request invoked on ${mapName}`)

    let out = (method == 'PUT' || method == 'POST')
        ? await set(map, req, params)
        : await get(params, query, map)

    if (!out && method == 'GET') {
        let errMsg = `Request failed! Response: ${out?.toString() ?? 'null'}`
        console.log(errMsg)

        return res.status(500)
    }

    switch(out) {
        case 'no-auth': return res.status(403).json("Refused to send request, invalid auth key!")
        case 'cache-miss': return res.status(503).json('Data not cached yet, try again soon.')
        case 'fetch-error': return res.status(500).json('Error fetching data, please try again.')
        default: {
            if (typeof out == 'string' && out.includes('does not exist')) {
                return res.status(404).json(out)
            }
            else {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader('Content-Type', 'application/json')
                res.setHeader('Accept-Encoding', 'br, gzip')

                return res.json(out)
            }
        }
    }
}

/**
* @param { String[] } params 
*/
const get = async (params, _query, map) => {
    args = params.slice(1) // Start from param after data type.

    const [dataType] = params
    const single = arg(0)
    const mapName = map == Nova ? 'nova' : 'aurora' 

    switch(dataType.toLowerCase()) {
        case 'news': {
            let news = cache.get(`${mapName}_news`)
            if (!news) return 'cache-miss'

            return !single ? news : news.all.filter(n => n.message.toLowerCase().includes(single))
        }
        case 'alliances': {
            let alliances = cache.get(`${mapName}_alliances`)
            if (!alliances) return 'cache-miss'

            switch (single) {
                case "submeganations":
                case "sub": return alliances.filter(a => a.type == 'sub')
                case "meganations": 
                case "mega": return alliances.filter(a => a.type == 'mega')
                case "normal":
                case "pact": return alliances.filter(a => a.type == 'normal')
                default: return !single ? alliances : alliances.find(a => a.allianceName.toLowerCase() == single)
            }
        }
        default: return `Parameter ${dataType} not recognized.`
    }
}

/**
* @param { String[] } params 
* @param { EMCMap } map 
*/
const set = async (map, req, params) => {
    let authKey = req.headers['authorization'],
        body = req.body, [dataType] = params

    if (authKey != process.env.AUTH_KEY) return 'no-auth'
    if (!body || Object.keys(body).length < 1) return null

    let mapName = map == Nova ? 'nova' : 'aurora',
        out = null

    switch(dataType) {
        case 'alliances':
        case 'news': {
            out = body
            break
        }
    }

    if (out) cache.put(`${mapName}_${dataType}`, out)
    return out
}

//const removeNulls = obj => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))

// const validParam = param => {
//     let arr = ['invitable', 'joinable', 'towns', 'nations', 'players', 'pact', 'sub', 'normal']
//     return arr.includes(param) ? null : `Parameter '${param}' not recognized.`
// }

export const runMiddleware = (req, res, fn) => new Promise((resolve, reject) => {
    fn(req, res, (result) => {
        if (result instanceof Error) return reject(result)
        return resolve(result)
    })
})

export {
    serve as default,
    serve,
}