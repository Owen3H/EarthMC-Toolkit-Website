const serve = require('../../../utils/route').default
export default (req, res) => serve(req, res, 'aurora')
export const config = {
    api: { bodyParser: { sizeLimit: '2MB' } }
}