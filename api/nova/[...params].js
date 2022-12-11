const route = require('../../../utils/route'),
      Cors = require('cors')

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'OPTIONS']
})

async function handler(req, res) {
    await route.runMiddleware(req, res, cors)
    route.serve(req, res, 'nova')
}

export default handler
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}