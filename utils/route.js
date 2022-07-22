const emc = require("earthmc"), endpoint = emc.endpoint,
      modify = require("earthmc-dynmap-plus/index")
    
var { NextApiResponse, NextApiRequest } = require('next')

/**
 * Handles how the response is served according to the map.
 * @param { NextApiRequest } req - The request object from the client.
 * @param { NextApiResponse } res - The response object to send, usually JSON.
 * @param { 'aurora' | 'nova' } map - The EarthMC map name to use. Defaults to 'aurora'.
 */
async function serve(req, res, mapName = 'aurora') {
    let { params } = req.query,
        map = mapName == 'nova' ? emc.Nova : emc.Aurora

    let out = req.method == 'POST' 
            ? await post(req.headers['AUTH_KEY'], req.body)
            : await get(params, map)

    switch(out) {
        case null:
        case undefined: return res.status(404).json('Error: Unknown or invalid request!')
        case 'no-auth': return res.status(403).json("Refused to send request, invalid auth key!")
        default: {
            if (out?.toLowerCase().includes('error')) res.status(500)
            else {
                res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=15')   
                res.status(200)
            }

            res.json(out)
        }
    }
}

const post = async (authKey, data) => {
    if (authKey != process.env.AUTH_KEY) return 'no-auth'
    if (!data || Object.keys(data).length < 1) return null

    return data
}

var args = [],
    arg = index => args[index]?.toLowerCase() ?? null

const get = async (params, map) => {
    args = params.splice(1)

    const { dataType } = params,
          single = arg(0), filter = arg(1)

    switch(dataType.toLowerCase()) {
        case 'markers': {
            let aType = validParam(filter) ?? 'mega'
            return await modify(mapName, aType) ?? "Error fetching modified map data, please try again."
        }
        case 'update': {
            let raw = await endpoint.playerData('aurora')
            if (raw?.updates) raw.updates = raw.updates.filter(e => e.msg != "areaupdated" && e.msg != "markerupdated") 
            else raw = "Error fetching player update, please try again."

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
                args[3], args[4] ?? args[3] 
            ]

            if (single == 'players') return map.getNearbyPlayers(...inputs)
            if (single == 'towns') return map.getNearbyTowns(...inputs)
            if (single == 'nations') return map.getNearbyNations(...inputs)
        }
        case 'allplayers': return single ? await map.getPlayer(single) : await map.getAllPlayers()
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