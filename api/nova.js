const { Nova } = require('earthmc')

const output = async data => {
    switch(data.toLowerCase()) {
        case 'towns': return await Nova.getTowns()
        case 'nations': return await Nova.getNations()
        case 'allplayers': return await Nova.getAllPlayers()
        case 'residents': return await Nova.getResidents()
        case 'townless': return await Nova.getTownless()
        case 'onlineplayers': return await Nova.getOnlinePlayers(true)
        default: return null
    }
}

async function handler(req, res) {
    const { data } = req.query
    if (!data) return res.status(404).send('Error: Data type not specified.')

    let out = await output(data)
    if (!out) return res.status(404).send(`Data parameter ${data} not recognized.`)

    res.status(200).json(out)
}

export {
    output,
    handler as default
}