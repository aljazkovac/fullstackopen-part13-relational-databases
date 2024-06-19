const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { Session} = require("../models");

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    console.log("Authorization = ", authorization)
    
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        console.log("Decoded token = ", req.decodedToken)
        // Check if the user has a valid login session, meaning a session which contains the token sent with the request.
        const sessions = await Session.findAll({ where: { user_id: req.decodedToken.id, token: authorization.substring(7) }})
        console.log('Sessions: ', sessions)
        if (sessions.length === 0) {
            return res.status(403).json({ error: 'User does not have a valid login session!' })
        }
    }
    else {
        return res.status(401).json({ error: 'Token missing' })
    }
    next()
}

module.exports = tokenExtractor;