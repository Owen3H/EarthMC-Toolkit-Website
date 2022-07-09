const getData = async (params, map) => {
    const [dataType, single] = params,
          value = single?.toLowerCase() ?? null

    switch(dataType) {
        case 'towns': return single ? await map.getTown(value) : await map.getTowns()  
        case 'nations': return single ? await map.getNation(value) : await map.getNations()
        case 'allplayers': return single ? await map.getPlayer(value) :await map.getAllPlayers()
        case 'residents': return single ? await map.getResident(value) : await map.getResidents()
        case 'onlineplayers': return single ? await map.getOnlinePlayer(value) : await map.getOnlinePlayers(true)
        default: return null
    }
}

async function serve(req, res, map) {
    let { params } = req.query,
        out = await getData(params, map)
        
    if (!out) return res.status(400).send(`Parameter ${data} not recognized.`)
    
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
    res.status(200).json(out)
}

export default serve