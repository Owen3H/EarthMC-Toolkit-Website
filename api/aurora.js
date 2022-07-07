const emc = require('earthmc')
module.exports = async (req, res) => {
    const { data } = req.query

    if (data.toLowerCase() == 'nations') {
        let nations = await emc.Aurora.getNations()
        return res.status(200).json(nations)
    }

    return res.status(404).send('Error: Data not specified.')
}