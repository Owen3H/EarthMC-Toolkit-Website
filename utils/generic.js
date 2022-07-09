const emc = require('earthmc')

const getData = async query => {
    const { params } = query
    switch(params) {
        case 'serverinfo': return await emc.getServerInfo()
        default: null
    }
}

async function serve(req, res) {
    let out = await getData(req.query)     
    if (!out) return res.status(400).send(`Parameter ${data} not recognized.`)
    
    res.status(200).json(out)
}

export default serve