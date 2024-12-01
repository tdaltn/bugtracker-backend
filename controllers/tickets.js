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
    const ticket = new Ticket(request.body)



    ticket.submitter = request.user.id
    ticket.priority = "High"
    ticket.status = "To Do"

    console.log(ticket)
    console.log(`request.user is : ${request.user}`)
  

    const savedTicket = await ticket.save()

  
    response.status(201).json(savedTicket)
})

ticketsRouter.put('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
      if (!request.token || !decodedToken.id) {
          return response.status(401).json({ error: 'token missing or invalid' })
      }
   
    const body = request.body
  
    const ticketObject = {
        name: body.name,
        description: body.description,
        project: body.project,
        assignee: body.assignee,
        type: body.type,
        submitter: body.submitter,
        priority: body.priority,
        status: body.status,
        id: request.params.id
    }

    const ticket = await Ticket.findByIdAndUpdate(request.params.id, ticketObject, { new: true, runValidators: true, context: 'query' })
    response.json(ticket)
  })

module.exports = ticketsRouter