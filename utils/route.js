const { Aurora, Nova, Map: EMCMap } = require("earthmc"),
      cache = require("memory-cache"),
      { Errors } = require("earthmc")
      
var args = []
const arg = index => args[index]?.toLowerCase() ?? null

const rateLimit = require('./rate-limit.ts')
const limiter = rateLimit({ interval: 10*1000 })

const getIP = req =>
    req.ip || req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress

async function serve(req, res, mapName = 'aurora') {
    try { await limiter.check(res, 15, getIP(req)) } 
    catch { return res.status(429).json({ error: 'Rate limit exceeded' }) }

    let map = mapName == 'nova' ? Nova : Aurora,
        { method, query } = req,
        { params } = query
    
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
* @param { EMCMap } map 
*/
const get = async (params, query, map) => {
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
            if (!filter) {
                let nation = await map.Nations.get(single)

                if (nation instanceof Errors.FetchError) return 'fetch-error'
                if (nation instanceof Errors.NotFoundError) return `${single} does not exist.`

                return nation
            }

            return validParam(filter) ?? await map.Towns.invitable(single, false)
        }
        case 'gps': {
            console.log(query)
            if (!query.x && !query.z) return 'Not enough arguments specified! Refer to the documentation.'

            const xCoord = parseInt(query.x.toLowerCase())
            if (!xCoord) return "Parameter `x` is invalid! A number is required."

            const zCoord = parseInt(query.z.toLowerCase())
            if (!zCoord) return "Parameter `z` is invalid! A number is required."

            const loc = { x: xCoord, z: zCoord }
            const type = query.type.toLowerCase()

            switch(type) {
                case 'avoidpublic': return await map.GPS.findRoute(loc, { 
                    avoidPublic: true, 
                    avoidPvp: false 
                })
                case 'avoidpvp': return await map.GPS.findRoute(loc, { 
                    avoidPublic: false, 
                    avoidPvp: true 
                })
                case 'safest': return await map.GPS.safestRoute(loc)
                case 'fastest':
                default: return await map.GPS.fastestRoute(loc)
            }  
        }
        case 'nearby': {
            if (args.length < 4) return 'Not enough arguments specified! Refer to the documentation.'

            let type = validParam(single)
            if (type) return type

            const xCoord = parseInt(args[1])
            const zCoord = parseInt(args[2])

            const xRadius = parseInt(args[3])
            const zRadius = parseInt(args[4] ?? xRadius)

            let inputs = [xCoord, zCoord, xRadius, zRadius]

            switch (single) {
                case 'towns': return await map.Towns.nearby(...inputs)
                case 'nations': {
                    const nearbyNations = await map.Nations.nearby(...inputs)
                    console.log(nearbyNations.map(n => `${n.name} - x: ${n.capital.x} z: ${n.capital.z}`))

                    return nearbyNations
                }
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
        case 'townless':
        case 'townlessplayers': return await map.Players.townless() ?? 'fetch-error'
        case 'onlineplayers': return single ? await map.Players.get(single) : await map.Players.online()
        case 'residents': return single ? await map.Residents.get(single) : await map.Residents.all()
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