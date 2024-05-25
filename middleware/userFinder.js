const { User } = require('../models');
const userFinder = async (req, res, next) => {
    req.user = await User.findByPk(req.params.id)
    next()
}

module.exports = userFinder;
