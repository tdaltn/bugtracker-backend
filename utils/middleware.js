const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.substring(7)
    }
    else{
      request.token = null
    }
    next()
}


const userExtractor = async (request, response, next) => {
  //console.log(request.token)
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)  
    const decodedToken = jwt.verify(token, process.env.SECRET)
    foundUser = await User.findById(decodedToken.id)
    request.user = foundUser
  }


  else{
    //request.user = User.findById(decodedToken.id)
  }
  next()
}


const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ 
        error: 'malformatted id' 
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ 
        error: error.message 
    })
  }  else if (error.name === 'JsonWebTokenError') {    
    return response.status(401).json({      
        error: 'invalid token'    
    })
  } else if (error.name === 'TokenExpiredError') {    
    return response.status(401).json({      
        error: 'token expired'    
    })  
  }
  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler
}