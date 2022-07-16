const modify = require("earthmc-dynmap-plus"),
      emc = require("earthmc"),
      endpoint = require("earthmc/endpoint")

const getData = async (params, mapName) => {
    const [dataType, ...args] = params,
          value = args[0] ? args[0].toLowerCase() : null,
          filter = args[1] ? args[1].toLowerCase() : null,
          map = mapName == 'nova' ? emc.Nova : emc.Aurora

    switch(dataType) {
        case 'markers': {
            let aType = validFilter(filter) ?? 'mega'
            return await modify(mapName, aType) ?? "Error fetching modified map data, please try again."
        }
        case 'update': {
            let raw = await endpoint.playerData('aurora')
            if (raw?.updates) raw.updates = raw.updates.filter(e => e.msg != "areaupdated" && e.msg != "markerupdated") 
            else raw = "Error fetching player update, please try again."

            return raw
        }
        case 'towns': {
            if (!value) return await map.getTowns()
            if (!filter) return await map.getTown(value)

            return validFilter(filter) ?? await map.getJoinableNations(value)
        }
        case 'nations': {
            if (!value) return await map.getNations()
            if (!filter) return await map.getNation(value)

            return validFilter(filter) ?? await map.getInvitableTowns(value, false)
        }
        case 'nearby': {
            
        }
        case 'allplayers': return value ? await map.getPlayer(value) : await map.getAllPlayers()
        case 'residents': return value ? await map.getResident(value) : await map.getResidents()
        case 'onlineplayers': return value ? await map.getOnlinePlayer(value) : await map.getOnlinePlayers(true)
        default: return `Parameter ${dataType} not recognized.`
    }
}

async function serve(req, res, map) {
    let { params } = req.query,
        out = await getData(params, map)

    if (!out) return res.status(400).send(out)
    
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=15')
    res.status(200).json(out)
}

const validFilter = filter => {
    let arr = ['invitable', 'joinable']
    if (arr.includes(filter)) return null
    return `Parameter ${filter} not recognized.`
}

export default serve