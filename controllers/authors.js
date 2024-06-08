const router = require('express').Router()
const { Blog } = require('../models')
const {sequelize} = require("../util/db");
router.get('/', async(req, res) => {
    const authors = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        group: ['author'],
        order: [['likes', 'DESC']]
        // This equals this SQL statement: SELECT "author", COUNT("id") AS "blogs", SUM("likes") AS "likes" FROM "blogs" AS "blog" GROUP BY "author"
    });
    // This sets the status code to 200 by default and ends the request-response cycle.
    return res.json(authors);
})

module.exports = router