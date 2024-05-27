const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (req, res) => {
    const body = req.body
    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = body.password === 'secret'
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password'
        })
    }

    // Determine the payload for the signing of the token 
    // (this is the information that will be returned when you decode the token).
    const userForToken = {
        username: user.username,
        id: user.id,
    }
    const token = jwt.sign(userForToken, SECRET)

    // Default to status 200.
    return res.send({ token, username: user.username, name: user.name })
})

module.exports = router