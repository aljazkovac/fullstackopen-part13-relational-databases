const { User, Blog, ReadingList, ReadingListMembership} = require('../models');
const userFinder = async (req, res, next) => {
    const blogWhere= {}
    const validReadValues = ['true', 'false']
    if (req.query.read && validReadValues.includes((req.query.read))) {
        blogWhere.read = req.query.read === 'true'
    } else if (req.query.read) {
        return res.status(400).json({ error: 'Invalid value for query parameter "read". It should be "true" or "false".'})
    }
    req.user = await User.findByPk(req.params.id, {
        include: [
            {
                model: Blog,
                attributes: { exclude: ['userId']},
                where: blogWhere
            },
            {
                model: ReadingList,
                attributes: ['name', 'id'],
                include: [
                    {
                        model: Blog,
                        attributes: { exclude: ['userId'] },
                        through: {
                            attributes: ['id']
                        }
                    }
                ]
            }
        ]
    })
    next()
}

module.exports = userFinder;
