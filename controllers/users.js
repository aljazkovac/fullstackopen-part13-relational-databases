const router = require('express').Router()
const { User, Blog } = require('../models')
const userFinder = require('../middleware/userFinder')
const bcrypt = require('bcrypt')
const tokenExtractor = require("../middleware/tokenExtractor");
const isAdmin = require("../middleware/isAdmin");
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

router.put('/:username', tokenExtractor, isAdmin, async(req, res) => {
    function updateUser(user) {
        if (req.body.username !== undefined) {
            user.username = req.body.username
        }
        if (req.body.disabled !== undefined) {
            user.disabled = req.body.disable
        }
        if (req.body.admin !== undefined) {
            user.admin = req.body.admin
        }
    }
    const user = await User.findOne({ 
        where: 
            { username: req.params.username }
    })

    if (!user) {
        return res.status(404).json('User not found.')
    }
    
    console.log('User: ', user)
    
    updateUser(user)
    await user.save()
    return res.json(user)
})

module.exports = router