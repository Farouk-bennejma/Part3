const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log('connecting to', url)

// Connecting to the DB
mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
})

// Setting up the schema
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})
  
// Updating the schema JSON
noteSchema.set('toJSON', {
transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
}
})
  
module.exports = mongoose.model('Note', noteSchema)