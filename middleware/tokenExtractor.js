const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    console.log("Authorization = ", authorization)
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        console.log("Decoded token = ", req.decodedToken)
    }
    else {
        return res.status(401).json({ error: 'Token missing' })
    }
    next()
}

module.exports = tokenExtractor;