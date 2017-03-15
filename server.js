require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

// common dal (data access layer)
const dal = require('./dal')

// cors middleware
app.use(cors({ origin: true, credentials: true }))

// rest api commands
app.get('/', (req, res) => res.send('Welcome to SimRx API!'))
app.get('/patients', dal.list('patient'))
app.post('/patients', dal.create('patient'))
app.get('/patients/:id', dal.read('patient'))
app.put('/patients/:id', dal.update('patient'))
app.delete('/patients/:id', dal.delete('patient'))

app.get('/doctors', dal.list('doctor'))
app.post('/doctors', dal.create('doctor'))
app.get('/doctors/:id', dal.read('doctor'))
app.put('/doctors/:id', dal.update('doctor'))
app.delete('/doctors/:id', dal.delete('doctor'))

app.post('/find', dal.find)

const port = process.env.PORT || 9000
app.listen(port)
console.log('listening on ' + port)
