const {User} = require("../models");
const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user.admin) {
        return res.status(401).json({ error: 'Operation not allowed.' })
    }
    next()
}

module.exports = isAdmin;