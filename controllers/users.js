const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Role = require('../models/role')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
  })

usersRouter.post('/', async (request, response) => {
  const { email, name, password } = request.body

  
  if (password.length < 3) {
      response.status(400).json('password is less than 3 character')
  }
  const existingUser = await User.findOne({ email })  

  if (existingUser) {    
    return response.status(400).json ({     
        error: 'username must be unique'    
    })  
  }



  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const defaultRole = await Role.findOne({ role: "Developer"})

  const user = new User({
    email,
    name,
    passwordHash,
    role: "User"
  })


  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
  /*
    const userid = decodedToken.id
  
    const blogtoUpdate = await Blog.findById(request.params.id)
    if ( blogtoUpdate.user.toString() !== userid.toString() ){
        return response.status(401).json({ error: 'A blog can be deleted only by the user who added the blog' })
    }

  */
 
  const body = request.body

  const userObject = {
      email: body.email,
      name: body.name,
      role: body.role,
      id: request.params.id
  }

  const user = await User.findByIdAndUpdate(request.params.id, userObject, { new: true, runValidators: true, context: 'query' })
  response.json(user)
})


module.exports = usersRouter