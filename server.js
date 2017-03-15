const express = require('express')
const app = express()
const cors = require('cors')
const crud = require('./crud')

app.use(cors({ origin: true, credentials: true }))

app.get('/', (req, res) => res.send('Welcome to SimRx API!'))
app.get('/patients', crud.list('patient'))
app.post('/patients', crud.create('patient'))
app.get('/patients/:id', crud.read('patient'))
app.put('/patients/:id', crud.update('patient'))
app.delete('/patients/:id', crud.delete('patient'))

app.get('/doctors', crud.list('doctor'))
app.post('/doctors', crud.create('doctor'))
app.get('/doctors/:id', crud.read('doctor'))
app.put('/doctors/:id', crud.update('doctor'))
app.delete('/doctors/:id', crud.delete('doctor'))

app.post('/find', crud.find)


app.listen(3000)
