const { User, Blog } = require('../models');
const userFinder = async (req, res, next) => {
    req.user = await User.findByPk(req.params.id, {
        include: {
            model: Blog
        }
    })
    next()
}

module.exports = userFinder;
