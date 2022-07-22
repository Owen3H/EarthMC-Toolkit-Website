const serve = require('../../../utils/route').default,
      { NextApiResponse: NextRes, NextApiRequest: NextReq } = require('next')

/**
 * Handles catch-all requests to api/aurora/
 * @param { NextReq } req - The request object from the client.
 * @param { NextRes } res - The response object to send, usually JSON. */
export default (req, res) => serve(req, res, 'aurora')