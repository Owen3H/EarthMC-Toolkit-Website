const { Aurora } = require('earthmc')

const output = async data => {
    switch(data[0].toLowerCase()) {
        case 'towns': return await Aurora.getTowns()
        case 'nations': return await Aurora.getNations()
        case 'allplayers': return await Aurora.getAllPlayers()
        case 'residents': return await Aurora.getResidents()
        case 'townless': return await Aurora.getTownless()
        case 'onlineplayers': return await Aurora.getOnlinePlayers(true)
        default: return null
    }
}

async function handler(req, res) {
    const { data } = req.query
    console.log(req.query)

    //if (!data) return res.status(404).send('Error: Data type not specified.')

    let out = await output(data)
    if (!out) return res.status(404).send(`Parameter ${data[0]} not recognized.`)
    
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate')
    res.status(200).json(out)
}

export {
    handler as default,
    output
}