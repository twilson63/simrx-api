// # CRUD Module
const cuid = require('cuid')

const request = require('request')
const url = 'http://localhost:5984/demo'
const { has, merge, propEq } = require('ramda')
const qs = require('querystring')

const JSONStream = require('JSONStream')

const toPull = require('stream-to-pull-stream')
const pull = require('pull-stream/pull')
const pmap = require('pull-stream/throughs/map')
const asyncMap = require('pull-stream/throughs/async-map')
const toJSON = v => JSON.parse(v.toString())

const validateName = res => (data, cb) => {
  if (has('name', data)) { return cb(null, data)}
  res.status(500).send({message: 'name is required'})
  cb(true)
}

const validateType = (model, res) => (data, cb) => {
  if (propEq('type', model, data)) {
    return cb(null, data)
  }
  res.status(500).send({message: 'type must equal ' + model})
  cb(true)
}

const createDoc = (json, cb) => {
  request.post(`${url}`, {json}, (e,r,b) => cb(e,b))
}

const updateDoc = id => (json, cb) => {
  request.put(`${url}/${id}`, {json}, (e,r,b) => cb(e,b))
}

const deleteDoc = id => (json, cb) => {
  request.delete(`${url}/${id}?rev=${json._rev}`, {json}, (e,r,b) => cb(e,b))
}

const sink = res => read => read(null, (err, data) => {
  if (err) { return res.status(500).send(err.message) }
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})

const createID = model => doc => merge(doc, {
  _id: model + '/' + cuid(),
  type: model
})

const handleRead = model => (req, res) =>
  request(`${url}/${model}%2f${req.params.id}`, {json: true}).pipe(res)

const handleCreate = model => (req, res) => {
  pull(
    toPull.source(req),
    pmap(toJSON),
    asyncMap(validateName(res)),
    pmap(createID(model)),
    asyncMap(createDoc),
    sink(res)
  )
}

const handleUpdate = model => (req, res) => {
  pull(
    toPull.source(req),
    pmap(toJSON),
    asyncMap(validateName(res)),
    asyncMap(validateType(model, res)),
    asyncMap(updateDoc(`${model}%2f${req.params.id}`)),
    sink(res)
  )
}

const handleDelete = model => (req, res) => {
  pull(
    toPull.source(req),
    pmap(toJSON),
    asyncMap(deleteDoc(`${model}%2f${req.params.id}`)),
    sink(res)
  )
}

const handleFind = (req, res) => {
  pull(
    toPull.source(req),
    pmap(toJSON),
    asyncMap((json, cb) => {
      request.post(`${url}/_find`, { json }, (e,r,b) => cb(e,b))
    }),
    pmap(res => res.docs),
    sink(res)
  )
}


const listOptions = (model, key) => qs.stringify({
  limit: 20,
  include_docs: true,
  startkey: `"${model}/${key || ''}"`,
  endkey: `"${model}/{}"`,
  skip: key ? 1 : 0
})

const handleList = model => (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  request(`${url}/_all_docs?${listOptions(model, req.query.next)}`, {json: true})
    .pipe(JSONStream.parse('rows.*.doc'))
    .pipe(JSONStream.stringify())
    .pipe(res)
}

module.exports = {
  create: handleCreate,
  read: handleRead,
  update: handleUpdate,
  delete: handleDelete,
  find: handleFind,
  list: handleList
}
