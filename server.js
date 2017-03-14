const express = require('express')
const app = express()
const request = require('request')
const url = 'http://localhost:5984/demo'
const qs = require('querystring')
const { compose, pluck, has } = require('ramda')
const bodyParser = require('body-parser')
const cuid = require('cuid')

app.get('/', (req, res) => res.send('Welcome to SimRx API!'))

app.get('/patients', (req, res) => {
  let q = {
    limit: 5,
    include_docs: true,
    startkey: `"patient/${req.query.next || ''}"`,
    endkey: '"patient/{}"'
  }
  if (req.query.next) { q.skip = 1 }

  let query = qs.stringify(q)

  const source = request(`${url}/_all_docs?${query}`, { json: true }, (e,r,b) => {
    if (e) { res.status(500).send(e.message) }
    compose(
      res.send.bind(res),
      pluck('doc')
    )(b.rows)
  })
})

app.post('/patients', bodyParser.json(), (req, res) => {
  //console.log(req.body)
  // validation ...
  if (!has('name', req.body)) { return res.status(500).send('Name is required!')}
  req.body._id = 'patient/' + cuid()
  req.body.type = 'patient'
  request.post(`${url}`, {
    json: req.body
  }, (e,r,b) => {
    if (e) { return res.status(500).send(e.message) }
    res.send(b)
  })
})

app.get('/patients/:id', (req, res) => {
  console.log(req.params.id)
  request(`${url}/patient%2f${req.params.id}`, {json: true}).pipe(res)
})

app.put('/patients/:id', bodyParser.json(), (req, res) => {
  request.put(`${url}/patient%2f${req.params.id}`, {json: req.body}).pipe(res)
})

app.delete('/patients/:id', bodyParser.json(), (req, res) => {
  request.delete(`${url}/patient%2f${req.params.id}?rev=${req.body._rev}`, {json: req.body}).pipe(res)
})

app.get('/doctors', (req, res) => {
  let q = {
    limit: 5,
    include_docs: true,
    startkey: `"doctor/${req.query.next || ''}"`,
    endkey: '"doctor/{}"'
  }
  if (req.query.next) { q.skip = 1 }

  let query = qs.stringify(q)

  const source = request(`${url}/_all_docs?${query}`, { json: true }, (e,r,b) => {
    if (e) { res.status(500).send(e.message) }
    compose(
      res.send.bind(res),
      pluck('doc')
    )(b.rows)
  })
})

app.post('/doctors', bodyParser.json(), (req, res) => {
  //console.log(req.body)
  // validation ...
  if (!has('name', req.body)) { return res.status(500).send('Name is required!')}
  req.body._id = 'doctor/' + cuid()
  req.body.type = 'doctor'
  request.post(`${url}`, {
    json: req.body
  }, (e,r,b) => {
    if (e) { return res.status(500).send(e.message) }
    res.send(b)
  })
})

app.get('/doctors/:id', (req, res) => {
  console.log(req.params.id)
  request(`${url}/doctor%2f${req.params.id}`, {json: true}).pipe(res)
})

app.put('/doctors/:id', bodyParser.json(), (req, res) => {
  request.put(`${url}/doctor%2f${req.params.id}`, {json: req.body}).pipe(res)
})

app.delete('/doctors/:id', bodyParser.json(), (req, res) => {
  request.delete(`${url}/doctor%2f${req.params.id}?rev=${req.body._rev}`, {json: req.body}).pipe(res)
})

app.get('/medications', (req, res) => {
  let q = {
    limit: 5,
    include_docs: true
  }
  if (req.query.next) { q.skip = 1 }

  let query = qs.stringify(q)

  const source = request.post(`${url}/_find`, {
    json: {
      selector: {
        name: {
          '$gte': req.query.q || 'A'
        }
      }
    } }, (e,r,b) => {
    if (e) { res.status(500).send(e.message) }

    res.send(b.docs)
  })
})

app.listen(3000)
