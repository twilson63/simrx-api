# SimRx API

A Sample HealthCare Application

## ENV

`COUCH_DATABASE=http://localhost:5984/demo npm start`

## Requirements

* CouchDB
* Load Data https://github.com/twilson63/simulate-rx-db
* NodeJS

## Developer Setup

* git clone https://github.com/twilson63/simrx-api
* npm install nodemon -g
* cd simrx-api
* npm install
* npm start

## Endpoints

* GET / - Welcome to SimRx API

* GET /patients
* POST /patients

```
POST /patients HTTP 1.1
Content-Type: application/json

{
  "_id": "doctor/cj0a12ge30000u2mlkohzsarc",
  "_rev": "2-b0d3e0fea73c17cea507810851e77420",
  "name": {
    "first": "Bob",
    "last": "Ramda"
  },
  "type": "patient"
}
```

* GET /patients/:id
* PUT /patients/:id
* DELETE /patients/:id

* GET /doctors
* POST /doctors
* GET /doctors/:id
* PUT /doctors/:id
* DELETE /doctors/:id

* POST /find

Example: find patient

```
POST /find HTTP 1.1
Content-Type: application/json

{
  "selector": {
  	"$and": [{
      "name.last": {
  		"$gte": "Smith"
  	  }
  	 },{
  	  "name.last": {
  		"$lt": "Smith{}"
  	  }
  	 }
    ]
  }
}
```

Example: find medication

```
POST /find HTTP 1.1
Content-Type: application/json

{
  "selector": {
  	"$and": [{
      "name": {
  		"$gte": "diazepam"
  	  }
  	 },{
  	  "name": {
  		"$lt": "diazepam{}"
  	  }
  	 }
    ]
  }
}
```

* [ ] POST /rx

* [x] cors
