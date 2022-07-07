const { Aurora } = require('earthmc')

const output = async data => {
    switch(data.toLowerCase()) {
        case 'towns': return await Aurora.getTowns()
        case 'nations': return await Aurora.getNations()
        default: return null
    }
}

async function handler(req, res) {
    //const { data } = req.query
    //if (!data) return res.status(404).send('Error: Data not specified.')

    let output = await output('towns')
    if (!output) return res.status(200).send(`Data parameter ${data} not recognized.`)

    res.status(200).json(output)
}

export {
    handler as default,
    output
}