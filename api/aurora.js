const emc = require('earthmc')

export default function handler(req, res) {
    const { data } = req.query

    if (data.toLowerCase() == 'nations') {
        let nations = await emc.Aurora.getNations()
        res.status(200).json(nations)
    }

    return res.status(404).send('Error: Data not specified.')
}