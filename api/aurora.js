const emc = require('earthmc')
async function nations(req, res) {
    const { data } = req.query

    if (data.toLowerCase() == 'nations') {
        let nations = await emc.Aurora.getNations()
        res.status(200).json(nations)
    }

    return res.status(404).send('Error: Data not specified.')
}

module.exports = { nations }