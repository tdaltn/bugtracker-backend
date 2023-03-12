const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  description: {
    type: String
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  assignee:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String
  },
  type: {
    type: String
  },
  status: {
    type: String
  }
},  {
      timestamps:true
    }
)

ticketSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket