const { Blog, User} = require('../models');
const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id, {
        attributes: { exclude: ['userId'] },
        include: { model: User, attributes: ['username']}
    })
    next()
}

module.exports = blogFinder;
