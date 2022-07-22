const emc = require('earthmc')

async function getData(param) {
    switch(param) {
        case 'serverinfo': return await emc.getServerInfo()
        default: return null
    }
}

async function serve(req, res) {
    let out = await getData(...req.query)     
    if (!out) return res.status(400).send(`Parameter ${data} not recognized.`)
    
    res.status(200).json(out)
}

export default serve