
const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')

const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const projectsRouter = require('./controllers/projects')
const rolesRouter = require('./controllers/roles')
const ticketsRouter = require('./controllers/tickets')


/*
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node index.js <password>')
    process.exit(1)
}
*/
//const MONGODB_URI=`mongodb+srv://bugtracker:${process.env.MONGODB_URI}@cluster0.dkm4poi.mongodb.net/bugtracker?retryWrites=true&w=majority`

mongoose.connect(config.MONGODB_URI)
    .then(result => {    
    logger.info('connected to MongoDB')  
    })  
    .catch((error) => {    
        logger.error('error connecting to MongoDB:', error.message)  
    })

app.use(cors())
app.use(express.static('build'))

//app.use(express.static(__dirname + 'index.html'));
app.use(express.json())

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/tickets', ticketsRouter)


///if below unknown endpoint error it will throw
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html')) 
})
///


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



/*

if (process.env.NODE_ENV === 'test') {  
    const testingRouter = require('./controllers/testing')  
    app.use('/api/testing', testingRouter)
}



*/
module.exports = app