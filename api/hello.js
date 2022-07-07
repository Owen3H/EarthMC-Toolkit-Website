export default function handler(req, res) {
    const { name } = req.query
    res.status(200).send(`Hello ${name}!`)
}