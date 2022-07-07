const { Aurora } = require('earthmc')

module.exports = async (req, res) => {
    function output(data) {
        switch(data.toLowerCase()) {
            case 'towns': return await Aurora.getTowns()
            case 'nations': return await Aurora.getNations()
            default: return `Data parameter ${data} not recognized.`
        }
    }

    const { data } = req.query
    if (!data) return res.status(404).send('Error: Data not specified.')

    let output = output(data)
    res.status(200).json(output)
}