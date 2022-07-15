const modify = require("earthmc-dynmap-plus"),
      emc = require("earthmc")

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
    
    res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate=30')
    res.status(200).json(out)
}

const validFilter = filter => {
    let arr = ['invitable', 'joinable']
    if (arr.includes(filter)) return null
    return `Parameter ${filter} not recognized.`
}

export default serve