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

app.get('/api/notes', async(req, res) => {
    try {
        const notes = await Note.findAll()
        res.json(notes)
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

app.get('/api/blogs', async(req, res) => {
    try {
        const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
        res.json(blogs)
        blogs.forEach(b => console.log(`${b.author}: '${b.title}', ${b.likes} likes`))
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error.' })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})