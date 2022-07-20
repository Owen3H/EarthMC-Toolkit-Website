const modify = require("earthmc-dynmap-plus"),
      emc = require("earthmc"),
      endpoint = require("earthmc/endpoint")

async function serve(req, res, map) {
    let { params } = req.query

    if (req.method === 'POST') {
        let out = await post(params, map)

        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=15')
        res.status(200).json(out)
    }
    else {
        let out = await get(params, map)
        if (!out) return res.status(400).send(out)
        
        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=15')
        res.status(200).json(out)
    }
}

const get = async (params, mapName) => {
    const [dataType, ...args] = params,
          map = mapName == 'nova' ? emc.Nova : emc.Aurora
    
    const single = args[0]?.toLowerCase() ?? null,
          filter = args[1]?.toLowerCase() ?? null   

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

const post = async (data, mapName) => {
    
}

const validParam = param => {
    let arr = ['invitable', 'joinable', 'towns', 'nations', 'players']
    return arr.includes(param) ? null : `Parameter ${param} not recognized.`
}

export default serve