const router = require('express').Router()
const { User, Blog } = require('../models')
const userFinder = require('../middleware/userFinder')
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId']}
        }
    })
    // This sets the status code to 200 by default and ends the request-response cycle.
    return res.json(users)
})

router.get('/:id', userFinder, async (req, res) => {
    return req.user ? res.json(req.user) : res.status(404).json( { message: 'User not found.' })
})

router.post('/', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' })
    }
    
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await User.create({ ...req.body, passwordHash: passwordHash })
    return res.status(201).json(user)
})

module.exports = router