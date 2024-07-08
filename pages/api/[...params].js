import serve from '../../utils/generic'

export default (req, res) => serve(req, res)
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}