import serve from '../../utils/generic.js'

export default (req, res) => serve(req, res)
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}