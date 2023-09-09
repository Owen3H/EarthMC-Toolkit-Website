const serve = require('../../utils/generic').default

export default (req, res) => serve(req, res)
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}