const emc = require('earthmc'),
      serve = require('../../../utils/route').default

export default (req, res) => serve(req, res, emc.Nova)