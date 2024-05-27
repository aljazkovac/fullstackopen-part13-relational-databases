const { ValidationError, DatabaseError } = require('sequelize')
const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
       return res.status(400).json({ error: err.errors.map(e => e.message) }) 
    }
    if (err instanceof DatabaseError) {
        return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token invalid' });
    }
    console.error(err.stack);
    next(err)
};

module.exports = errorHandler;
