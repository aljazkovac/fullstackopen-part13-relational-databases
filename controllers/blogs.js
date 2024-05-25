const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async(req, res, next) => {
    try {
        const blogs = await Blog.findAll()
        console.log(JSON.stringify(blogs), null, 2)
        return res.json(blogs)

    } catch(error) {
        next(error)
    }
})

router.get('/:id', blogFinder, async(req, res, next) => {
    try {
        if (req.blog) {
            return res.json(req.blog)
        }
        else {
           return res.status(404).json({ message: 'Blog not found.' })
        }
    }
    catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body)
        console.log(blog.toJSON())
        return res.json(blog)
    }
    catch (error) {
        next(error)
    }
})

router.put('/:id', blogFinder, async (req, res, next) => {
    function updateBlog(blog) {
        blog.author = req.body.author
        blog.url = req.body.url
        blog.title = req.body.title
        blog.likes = req.body.likes
    }

    try {
        if (req.blog) {
            updateBlog(req.blog);
            await req.blog.save()
            return res.json(req.blog)
        }
        else {
            return res.status(404).json({ error: 'Blog not found.' })
        }
    }
    catch (error) {
        next(error)
    }
})

router.delete('/:id', blogFinder, async(req, res, next) => {
    try {
        if (req.blog) {
            await req.blog.destroy()
            return res.status(204).json({ message: 'Blog deleted.' })
        }
        else {
            return res.status(404).json({ error: 'Blog not found.' })
        }
    }
    catch (error) {
        next(error)
    }
})

module.exports = router