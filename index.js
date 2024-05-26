require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

const errorHandler = (error, request, response, next) => {
  console.error("I got here", error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Im here malformatted id' })
  } 

  next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())


app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note => {
    if(note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log("Maybe here")
    next(error)
})
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.put('/api/notes/:id', (request, response) => {
  const body = request.body
  const id = Number(request.params.id)

  notes = notes.filter(note => note.id !== id)
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }
  notes = notes.concat(note)

  response.json(note)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note({
    content: body.content,
    important: (body.important) || false,
  })

  note.save()
  .then(result => {
    console.log(`Added ${note.content} with importance set to ${note.important}`)
    mongoose.connection.close()
  })
  .catch(error => {
    console.log('error adding new note: ', error.message)
  })

  response.json(note)
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})