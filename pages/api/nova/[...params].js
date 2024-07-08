import { runMiddleware, serve } from '../../../utils/route'
import Cors from 'cors'

// Initialize CORS
const cors = Cors({ methods: ['GET', 'POST', 'PUT', 'OPTIONS'] })
async function handler(req, res) {
    await runMiddleware(req, res, cors)
    serve(req, res, 'nova')
}

export default handler
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}