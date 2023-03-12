const bcrypt = require('bcrypt')
const ticketsRouter = require('express').Router()
const Ticket = require('../models/ticket')
const jwt = require('jsonwebtoken')


ticketsRouter.get('/', async (request, response) => {
    const tickets = await Ticket.find({})

        
    
    response.json(tickets)
})

ticketsRouter.post('/', async (request, response) => {

    console.log(request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)  
    if (!decodedToken.id) {    
      return response.status(401).json({ error: 'token missing or invalid' })  
    }  

    //update roles
    //update users with roles
    const ticket = new Ticket(request.body)



    ticket.submitter = request.user.id
    ticket.priority = "High"
    ticket.status = "To Do"

    //project.roles = project.roles.concat()
    console.log(ticket)
    console.log(`request.user is : ${request.user}`)
  
    //Project.roles = user
    const savedTicket = await ticket.save()
    //user.blogs = user.blogs.concat(savedBlog._id)
    //await user.save()
  
    response.status(201).json(savedTicket)
})

module.exports = ticketsRouter