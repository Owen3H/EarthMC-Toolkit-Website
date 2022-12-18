
const { Aurora, Nova } = require("earthmc"),
      EMCMap = require("earthmc/src/Map"),
      cache = require("memory-cache")

var arg = index => args[index]?.toLowerCase() ?? null,
    args = []

const rateLimit = require('./rate-limit.ts').default
const limiter = rateLimit({ interval: 7*1000 })

const getIP = req =>
    req.ip || req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress

async function serve(req, res, mapName = 'aurora') {
    try { await limiter.check(res, 6, getIP(req)) } 
    catch { return res.status(429).json({ error: 'Rate limit exceeded' }) }

    let { params } = req.query,
        map = mapName == 'nova' ? Nova : Aurora
    
    console.log(`${req.method} request invoked on map: ${mapName}`)

    let out = req.method == 'POST' || req.method == 'PUT'
            ? await set(map, req, params) : await get(params, map)

    if (!out) return res.status(404).json('Error: Unknown or invalid request!')
    switch(out) {
        case 'no-auth': return res.status(403).json("Refused to send request, invalid auth key!")
        case 'cache-miss': return res.status(503).json('Data not cached yet, try again soon.')
        case 'fetch-error': return res.status(500).json('Error fetching data, please try again.')
        default: {
            if (typeof out == 'string' && out.includes('does not exist')) res.status(404).json(out)
            else {
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader('Content-Type', 'application/json')
                res.setHeader('Accept-Encoding', 'br, gzip')

                res.status(200).json(out)
            }
        }
    }
}

/**
* @param {String[]} params 
* @param {EMCMap} map 
*/
const get = async (params, map) => {
    args = params.slice(1) // Start from param after data type.
    const [dataType] = params,
          single = arg(0), filter = arg(1),
          mapName = map == Nova ? 'nova' : 'aurora' 

    switch(dataType.toLowerCase()) {
        case 'towns': {
            if (!single) return await map.Towns.all()
            if (!filter) return await map.Towns.get(single)

            return validParam(filter) ?? await map.Nations.joinable(single)
        }
        case 'nations': {
            if (!single) return await map.Nations.all()
            if (!filter) return await map.Nations.get(single)

            return validParam(filter) ?? await map.Towns.invitable(single, false)
        }
        case 'nearby': {
            if (args.length < 4) return 'Not enough arguments specified! Refer to the documentation.'

            let type = validParam(single)
            if (type) return type

            let optional = args[4] ?? args[3],
                inputs = [args[1], args[2], args[3], optional]

            switch (single) {
                case 'towns': return await map.Towns.nearby(...inputs)
                case 'nations': return await map.Nations.nearby(...inputs)
                case 'players':
                default: return await map.Players.nearby(...inputs)
            }
        }
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
        case 'allplayers': {
            let cachedPlayers = cache.get(`${mapName}_allplayers`)
            if (!cachedPlayers) return 'cache-miss'
            if (!single) return cachedPlayers

            const player = cachedPlayers.find(p => p.name.toLowerCase() == single)
            return player ?? "That player does not exist!"
        }
        case 'townless':
        case 'townlessplayers': return await map.Players.townless() ?? 'fetch-error'
        case 'onlineplayers': return single ? await map.Players.get(single) : await map.Players.online(true)
        case 'residents': return single ? await map.Residents.get(single) : await map.Residents.all()
        default: return `Parameter ${dataType} not recognized.`
    }
}

/**
* @param {String[]} params 
* @param {EMCMap} map 
*/
const set = async (map, req, params) => {
    let authKey = req.headers['authorization'],
        body = req.body, [dataType] = params

    if (authKey != process.env.AUTH_KEY) return 'no-auth'
    if (!body || Object.keys(body).length < 1) return null

    let mapName = map == Nova ? 'nova' : 'aurora',
        out = null

    switch(dataType) {
        case 'allplayers': {
            let allPlayers = await map.Players.all().catch(e => console.log(e))
            if (!allPlayers || allPlayers.length < 1) return 'fetch-error'

            out = mergeCustomInfo(allPlayers, body)
            console.log(`Merged length: ${out.length}`)

            break
        }
        case 'alliances':
        case 'news': out = body
    }

    if (out) cache.put(`${mapName}_${dataType}`, out)
    return out
}

const cleanObj = obj => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
const mergeCustomInfo = (arr, body) => {
    //console.log('Arr length: ' + arr.length + '\nBody length: ' + body.length)
    console.time('mergeCustomInfo')

    // Merge both arrays based on 'name' key.
    const map = new Map()
    arr.forEach(p => map.set(p.name, p))
    body.forEach(p => map.set(p.name, { ...map.get(p.name), ...p }))
    let merged = Array.from(map.values())

    // Remove all keys containing null/undefined values.
    let i = 0, len = merged.length
    for (i; i < len; i++) merged[i] = cleanObj(merged[i])
    
    console.timeEnd('mergeCustomInfo')
    return merged
}

const validParam = param => {
    let arr = ['invitable', 'joinable', 'towns', 'nations', 'players', 'pact', 'sub', 'normal']
    return arr.includes(param) ? null : `Parameter '${param}' not recognized.`
}

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result)
            return resolve(result)
        })
    })
}

export {
    serve as default,
    serve,
    runMiddleware
}