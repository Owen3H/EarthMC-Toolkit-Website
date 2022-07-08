const multi = async (data, map) => {
    switch(data.toLowerCase()) {
        case 'towns': return await map.getTowns()
        case 'nations': return await map.getNations()
        case 'allplayers': return await map.getAllPlayers()
        case 'residents': return await map.getResidents()
        case 'townless': return await map.getTownless()
        case 'onlineplayers': return await map.getOnlinePlayers(true)
        default: return null
    }
}

const single = async (data, map) => {
    let value = data[1].toLowerCase()
    switch(data[0].toLowerCase()) {
        case 'towns': return await map.getTown(value)
        case 'nations': return await map.getNation(value)
        case 'allplayers': return await map.getPlayer(value)
        case 'residents': return await map.getResident(value)
        case 'onlineplayers': return await map.getOnlinePlayer(value)
        default: return null
    }
}

async function send(req, res, map) {
    if (Object.keys(req.query).length < 1)
        return res.status(404).send('Error: Data type not specified.')

    const { data } = req.query
   
    let out = Array.isArray(data) ? await single(data, map) : await multi(data, map)
    if (!out) return res.status(400).send(`Parameter ${data} not recognized.`)
    
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
    res.status(200).json(out)
}

export {
    send as default,
    send
}