const route = require('../../../utils/route'),
      Cors = require('cors')

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'OPTIONS']
})

export default (req, res) => {
    await route.runMiddleware(req, res, cors)
    route.serve(req, res, 'aurora') 
}