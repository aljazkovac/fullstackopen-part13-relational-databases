const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')
const tokenExtractor = require("../middleware/tokenExtractor");

router.post('/', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({
        where: {
            username: username
        }
    })

    const passwordCorrect = user === null 
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password'
        })
    }
    
    if (user.disabled) {
        return res.status(403).json({
            error: 'Account disabled, please contact admin.'
        })
    }

    // Determine the payload for the signing of the token 
    // (this is the information that will be returned when you decode the token).
    const userForToken = {
        username: user.username,
        id: user.id,
    }
    const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' })
    
    const session = await Session.create({userId: user.id, token: token})
    console.log('Session: ', session)

    // Default to status 200.
    return res.send({ token, username: user.username, name: user.name })
})

router.delete('/', tokenExtractor, async(req, res) => {
    await Session.destroy({ 
        where: { 
            user_id: req.decodedToken.id
        }
    })
    return res.status(200).json({ message: 'Logged out successfully' })
})

module.exports = router