import { runMiddleware, serve } from '../../../utils/route'
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({ methods: ['GET', 'POST', 'PUT', 'OPTIONS'] })
async function handler(req, res) {
    await runMiddleware(req, res, cors)
    serve(req, res, 'aurora') 
}

export default handler
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}