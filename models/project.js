const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  description: {
    type: String
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
  ]
},  {
    timestamps:true
  }
)

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project