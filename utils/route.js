const getData = async (params, map) => {
    const [dataType, single, filter] = params,
          value = single?.toLowerCase() ?? null

    switch(dataType) {
        case 'towns': {
            if (!single) return await map.getTowns()
            if (!filter) return await map.getTown(value)

            return filter.toLowerCase() == "joinable" ? await map.getJoinableNations(value) : `Parameter ${filter} not recognized.`
        }
        case 'nations': {
            if (!single) return await map.getNations()
            if (!filter) return await map.getNation(value)

            return filter.toLowerCase() == "invitable" ? await map.getInvitableTowns(value, false) : `Parameter ${filter} not recognized.`
        }
        case 'allplayers': return single ? await map.getPlayer(value) :await map.getAllPlayers()
        case 'residents': return single ? await map.getResident(value) : await map.getResidents()
        case 'onlineplayers': return single ? await map.getOnlinePlayer(value) : await map.getOnlinePlayers(true)
        default: return `Parameter ${dataType} not recognized.`
    }
}

async function serve(req, res, map) {
    let { params } = req.query,
        out = await getData(params, map)
        
    if (!out) return res.status(400).send(out)
    
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
    res.status(200).json(out)
}

export default serve