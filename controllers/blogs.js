const router = require('express').Router()
const { Blog, User } = require('../models')
const blogFinder = require('../middleware/blogFinder')
const tokenExtractor = require('../middleware/tokenExtractor')
const {Op} = require("sequelize");
router.get('/', async(req, res) => {
    // Filter blog titles only if there is a search condition in the query.
    const searchWhere= {}
    if (req.query.search) {
        searchWhere[Op.or] = [
            { title: { [Op.substring]: req.query.search} },
            { author: { [Op.substring]: req.query.search} }
        ]
    }
    const blogs = await Blog.findAll({ 
        attributes: { exclude: ['userId'] },
        include: { model: User, attributes: ['username']}, where: searchWhere,
        order: [['likes', 'DESC']] // NOTE: You need nested parentheses here.
    })
    // This sets the status code to 200 by default and ends the request-response cycle.
    return res.json(blogs)
})

router.get('/:id', blogFinder, async(req, res) => {
    return req.blog ? res.json(req.blog) : res.status(404).json({ message: 'Blog not found.' });
})

router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    return res.status(201).json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
    function updateBlog(blog) {
        blog.author = req.body.author
        blog.url = req.body.url
        blog.title = req.body.title
        blog.likes = req.body.likes
        blog.year = req.body.year
        blog.read = req.body.read
    }

    if (req.blog) {
        updateBlog(req.blog);
        await req.blog.save()
        return res.json(req.blog)
    }
    else {
        return res.status(404).json({ error: 'Blog not found.' })
    }
})

router.delete('/:id', tokenExtractor, blogFinder, async(req, res) => {
    if (req.blog) {
        if (req.blog.user.username !== req.decodedToken.username) {
            return res.status(403).json({ error: 'Permission denied!'})
        }
        await req.blog.destroy()
        return res.status(204).end()
    }
    else {
        return res.status(404).json({ error: 'Blog not found.' })
    }
})

module.exports = router