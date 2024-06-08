const express = require('express')
// Makes it possible to get rid of all the try-catch blocks in async functions, as well as calls to next(error). 
require('express-async-errors')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const authorsRouter = require('./controllers/authors')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(express.json()) // Middleware for parsing JSON.
app.use('/api/blogs', blogsRouter) // Middleware for route handling.
app.use('/api/users', usersRouter) // Middleware for user handling.
app.use('/api/login', loginRouter) // Middleware for login handling.
app.use('/api/authors', authorsRouter) // Middleware for author handling.
app.use(errorHandler) // Middleware for error handling.

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()