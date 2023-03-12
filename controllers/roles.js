const bcrypt = require('bcrypt')
const rolesRouter = require('express').Router()
//const User = require('../models/user')
const Role = require('../models/role')
const jwt = require('jsonwebtoken')


rolesRouter.get('/', async (request, response) => {
    const roles = await Role.find({})

        
    
    response.json(roles)
})

module.exports = rolesRouter