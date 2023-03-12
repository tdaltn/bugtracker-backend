const bcrypt = require('bcrypt')
const projectsRouter = require('express').Router()
const Project = require('../models/project')
//const User = require('../models/user')
const Role = require('../models/role')
const jwt = require('jsonwebtoken')

/*

        .populate({
            path: 'roles',
            model: 'Role',
            populate: {
                path: 'users',
            }




            Teacher.findOne({_id: req.params.teacherId})
  .populate({ 
     path: 'students',
     populate: {
       path: 'courses'
     } 
  })
  .exec(function(err, docs) {});
*/


projectsRouter.get('/', async (request, response) => {
    const projects = await Project
        .find({})

        
    
    response.json(projects)
  })

projectsRouter.post('/', async (request, response) => {

    console.log(request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)  
    if (!decodedToken.id) {    
      return response.status(401).json({ error: 'token missing or invalid' })  
    }  

    //update roles
    //update users with roles
    const project = new Project(request.body)
    //project.roles = project.roles.concat()
    console.log(project)
  
    //Project.roles = user
    const savedProject = await project.save()
    //user.blogs = user.blogs.concat(savedBlog._id)
    //await user.save()
  
    response.status(201).json(savedProject)
})

projectsRouter.put('/:id', async (request, response) => {
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
  
    const projectObject = {
        name: body.name,
        description: body.description,
        users: body.users,
        id: request.params.id
    }
    const project = await Project.findByIdAndUpdate(request.params.id, projectObject, { new: true, runValidators: true, context: 'query' })
    response.json(project)
  })
  

module.exports = projectsRouter