const { Aurora, Nova } = require("earthmc"),
      cache = require("memory-cache"),
      { CacheControl, CacheType } = require("./CacheControl")

var arg = index => args[index]?.toLowerCase() ?? null,
    args = []

const rateLimit = require('./rate-limit.ts').default,
      limiter = rateLimit({ interval: 8*1000 })

const getIP = req =>
    req.ip || req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress

var cc = new CacheControl()

async function serve(req, res, mapName = 'aurora') {
    try { await limiter.check(res, 10, getIP(req)) } 
    catch { return res.status(429).json({ error: 'Rate limit exceeded' }) }

    let { params } = req.query,
        map = mapName == 'nova' ? Nova : Aurora
    
    console.log(`Receiving ${req.method} request for ${mapName}`)

    let out = req.method == 'POST' || req.method == 'PUT'
            ? await set(map, req, params)
            : await get(params, map)

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

                let [maxAge, stale] = cc.get()
                res.setHeader('Cache-Control', `s-maxage=${maxAge}, stale-while-revalidate=${stale}`)

                console.log(`Max age: ${maxAge}\nStale: ${stale}`)
                console.log(`Actual: ${res.getHeader('Cache-Control')}`)

                res.status(200).json(out)
            }
        }
    }
}

const get = async (params, map) => {
    cc.reset() // Reset headers to default -> [30, 60]

    args = params.slice(1) // Start from param after data type.
    const [dataType] = params,
          single = arg(0), filter = arg(1),
          mapName = map == Nova ? 'nova' : 'aurora' 

    switch(dataType.toLowerCase()) {
        case 'towns': {
            cc.set(CacheType.Towns)

            if (!single) return await map.getTowns()
            if (!filter) return await map.getTown(single)

            return validParam(filter) ?? await map.getJoinableNations(single)
        }
        case 'nations': {
            cc.set(CacheType.Nations)

            if (!single) return await map.getNations()
            if (!filter) return await map.getNation(single)

            return validParam(filter) ?? await map.getInvitableTowns(single, false)
        }
        case 'nearby': {
            if (args.length < 4) return 'Not enough arguments specified! Refer to the documentation.'

            let type = validParam(single)
            if (type) return type

            let inputs = [
                args[1], args[2], 
                args[3], args[4] ?? args[3]]

            switch (single) {
                case 'towns': {
                    cc.set(CacheType.Nearby.Towns)
                    return await map.getNearbyTowns(...inputs) 
                }
                case 'nations': {
                    cc.set(CacheType.Nearby.Nations)
                    return await map.getNearbyNations(...inputs)
                }
                case 'players':
                default: {
                    cc.set(CacheType.Nearby.Players)
                    return await map.getNearbyPlayers(...inputs)
                }
            }
        }
        case 'news': {
            let news = cache.get(`${mapName}_news`)
            if (!news) return 'cache-miss'

            cc.set(CacheType.News)
            return !single ? news : news.all.filter(n => n.message.toLowerCase().includes(single))
        }
        case 'alliances': {
            let alliances = cache.get(`${mapName}_alliances`)
            if (!alliances) return 'cache-miss'

            cc.set(CacheType.Alliances)

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

            cc.set([60, 120])

            const player = cachedPlayers.find(p => p.name.toLowerCase() == single)
            return player ?? "That player does not exist!"
        }
        case 'townless':
        case 'townlessplayers': {
            cc.disable()
            return await map.getTownless() ?? 'fetch-error'
        }
        case 'onlineplayers': {
            cc.disable()
            return single ? await map.getOnlinePlayer(single) : await map.getOnlinePlayers(true)
        }
        case 'residents': {
            cc.set(CacheType.Towns)
            return single ? await map.getResident(single) : await map.getResidents()
        }
        default: return `Parameter ${dataType} not recognized.`
    }
}

const set = async (map, req, params) => {
    let authKey = req.headers['authorization'],
        body = req.body, [dataType] = params

    if (authKey != process.env.AUTH_KEY) return 'no-auth'
    if (!body || Object.keys(body).length < 1) return null

    let mapName = map == Nova ? 'nova' : 'aurora',
        out = null

    switch(dataType) {
        case 'allplayers': {
            let allPlayers = await map.getAllPlayers().catch(() => {})
            if (!allPlayers) return 'fetch-error'

            out = mergeByName(allPlayers, body)
        }
        case 'alliances':
        case 'news': out = body
    }

    if (out) cache.put(`${mapName}_${dataType}`, out)
    return out
}

const mergeByName = (pArr, req) => pArr.map(p => ({ ...req.find(e => (e.name === p.name) && e), ...p })) 
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