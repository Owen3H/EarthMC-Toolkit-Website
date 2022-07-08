const { Nova } = require('earthmc'),
      utils = require('../_utils'),
      { useRouter } = require('next/router')

export default (req, res) => {
    const router = useRouter()

    console.log(router.query)
    console.log(req.query)

    const { data = [] } = router.query
    utils.send(data, res, Nova)
}