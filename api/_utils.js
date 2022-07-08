const output = (data, map) => {
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

export default function send(req, res, map) {
    const data = req.query.data
    if (!data) return res.status(404).send('Error: Data type not specified.')

    let out = await output(data, map)
    if (!out) return res.status(404).send(`Parameter ${data} not recognized.`)
    
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
    res.status(200).json(out)
}

export {
    send,
    output
}