const { Aurora } = require('earthmc')

const output = async data => {
    switch(data.toLowerCase()) {
        case 'towns': return await Aurora.getTowns()
        case 'nations': return await Aurora.getNations()
        default: return `Data parameter ${data} not recognized.`
    }
}

async function handler(req, res) {
    const { data } = req.query
    if (!data) return res.status(404).send('Error: Data not specified.')

    res.status(200).json(await output(data))
}

export default handler