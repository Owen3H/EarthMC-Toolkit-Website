const serve = require('../../utils/generic').default,
      { NextApiResponse: NextRes, NextApiRequest: NextReq } = require('next')

/**
 * Handles generic mapless requests to api/something/
 * @param { NextReq } req - The request object from the client.
 * @param { NextRes } res - The response object to send, usually JSON. */
export default (req, res) => serve(req, res)