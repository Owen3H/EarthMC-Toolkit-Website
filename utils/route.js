const emc = require("earthmc"), endpoint = emc.endpoint,
      modify = require("earthmc-dynmap-plus/index"),
      cache = require("memory-cache")
    
var next = require('next'),
    arg = index => args[index]?.toLowerCase() ?? null,
    args = []

const rateLimit = require('./rate-limit.ts').default,
      limiter = rateLimit({ interval: 6 * 1000 })

/**
 * Handles how the response is served according to the map.
 * @param { next.NextApiRequest } req - The request object from the client.
 * @param { next.NextApiResponse } res - The response object to send, usually JSON.
 * @param { 'aurora' | 'nova' } map - The EarthMC map name to use. Defaults to 'aurora'.
 */
async function serve(req, res, mapName = 'aurora') {
    try { await limiter.check(res, 14, 'CACHE_TOKEN') } 
    catch { res.status(429).json({ error: 'Rate limit exceeded' }) }

    let { params } = req.query,
        map = mapName == 'nova' ? emc.Nova : emc.Aurora
        
    let out = req.method == 'GET' 
            ? await get(params, map)
            : await post(map, req, params)

    if (!out) return res.status(404).json('Error: Unknown or invalid request!')
    switch(out) {
        case 'no-auth': return res.status(403).json("Refused to send request, invalid auth key!")
        case 'cache-miss': return res.status(503).json('Data not cached yet, try again soon.')
        case 'fetch-error': return res.status(500).json('Error fetching data, please try again.')
        default: {
            if (typeof out == 'string' && out.includes('does not exist')) res.status(404).json(out)
            else {
                let [maxage, stale] = out.sets || out.currentcount ? [2, 30] : [30, 180]

                res.setHeader('Access-Control-Allow-Origin', '*')
                res.setHeader('Content-Type', 'application/json')
                res.setHeader('Accept-Encoding', 'br')
                res.setHeader('Cache-Control', `s-maxage=${maxage}, stale-while-revalidate=${stale}`)   

                res.status(200).json(out)
            }
        }
    }
}

const post = async (map, req, params) => {
    let authKey = req.headers['authorization'],
        data = req.body, [dataType] = params

    if (authKey != process.env.AUTH_KEY) return 'no-auth'
    if (!data || Object.keys(data).length < 1) return null

    switch(dataType) {
        case 'allplayers': {
            var allPlayers = await map.getAllPlayers().catch(() => {})
            if (!allPlayers) return 'fetch-error'

            const mergeByName = (a1, a2) => a1.map(itm => ({...a2.find(item => (item.name === itm.name) && item), ...itm}))
            data = mergeByName(allPlayers, req.body)
        }
    }

    cache.put(`${map}_${dataType}`, data)
}

const get = async (params, map) => {
    args = params.slice(1)

    const [dataType] = params,
          single = arg(0), filter = arg(1)

    switch(dataType.toLowerCase()) {
        case 'markers': {
            let aType = validParam(filter) ?? 'mega'
            return await modify(map == emc.Nova ? 'nova' : 'aurora', aType) ?? 'fetch-error'
        }
        case 'update': {
            let raw = await endpoint.playerData('aurora')
            if (raw?.updates) raw.updates = raw.updates.filter(e => e.msg != "areaupdated" && e.msg != "markerupdated") 
            else raw = 'fetch-error'

            return raw
        }
        case 'towns': {
            if (!single) return await map.getTowns()
            if (!filter) return await map.getTown(single)

            return validParam(filter) ?? await map.getJoinableNations(single)
        }
        case 'nations': {
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
                case 'players': return map.getNearbyPlayers(...inputs) 
                case 'towns': return map.getNearbyTowns(...inputs) 
                case 'nations': return map.getNearbyNations(...inputs) 
                default: return null
            }
        }
        case 'news': {
            var news = cache.get(`${map}_news`)
            if (!news) return 'cache-miss'

            return !single ? news : news.all.filter(n => n.message.toLowerCase().includes(single))
        }
        case 'alliances': {
            let alliances = cache.get(`${map}_alliances`)
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
            var cachedPlayers = cache.get(`${map}_allplayers`)
            if (!cachedPlayers) return await map.getAllPlayers().catch(() => {})
            if (!single) return cachedPlayers

            var player = cachedPlayers.find(p => p.name.toLowerCase() == single)
            return player ?? "That player does not exist!"
        }
        case 'residents': return single ? await map.getResident(single) : await map.getResidents()
        case 'onlineplayers': return single ? await map.getOnlinePlayer(single) : await map.getOnlinePlayers(true)
        default: return `Parameter ${dataType} not recognized.`
    }
}

const validParam = param => {
    let arr = ['invitable', 'joinable', 'towns', 'nations', 'players']
    return arr.includes(param) ? null : `Parameter ${param} not recognized.`
}

export default serve