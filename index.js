require('dotenv').config()
const { Sequelize, Model, QueryTypes, DataTypes } = require('sequelize')
const express = require('express')
const app = express()
app.use(express.json()) // Parse JSON bodies

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: process.env.NODE_ENV === 'production' ? {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    } : {},
});

// *** NOTES ***
class Note extends Model {}
Note.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    important: {
        type: DataTypes.BOOLEAN
    },
    date: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note'
})

// Creates the table if it doesn't exist.
Note.sync()

app.get('/api/notes', async(req, res) => {
    try {
        const notes = await Note.findAll()
        return res.json(notes)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error.' })
    }
})

app.post('/api/notes', async (req, res) => {
    try {
        const note = await Note.create(req.body)
        return res.json(note)
        
    } catch(error) {
        return res.status(400).json({error})
    }
})

// *** BLOGS ***
class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

// Creates the table if it doesn't exist.
Blog.sync()

app.get('/api/blogs', async(req, res) => {
    try {
        const blogs = await Blog.findAll()
        console.log(JSON.stringify(blogs), null, 2)
        return res.json(blogs)
        
    } catch(error) {
        return res.status(500).json({ error: 'Internal server error.' })
    }
})

app.get('/api/blogs/:id', async(req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
            console.log(blog.toJSON())
            return res.json(blog)
        }
        else {
           res.status(404).json({ message: 'Blog not found.' })
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error.' })
    }
})

app.post('/api/blogs', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        console.log(blog.toJSON())
        return res.json(blog)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.put('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
            blog.author = req.body.author
            blog.url = req.body.url
            blog.title = req.body.title
            blog.likes = req.body.likes
            console.log(blog.toJSON())
            await blog.save()
            return res.json(blog)
        }
        else {
            res.status(404).json({ error: 'Blog not found.' })
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.delete('/api/blogs/:id', async(req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        if (blog) {
            console.log('Deleting blog: ', blog.toJSON())
            await blog.destroy()
            res.status(200).json({ message: 'Blog deleted.' })
        }
        else {
            res.status(404).json({ error: 'Blog not found.' })
        }
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})