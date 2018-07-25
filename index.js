const express = require('express')
const bodyParser = require('body-parser')

var app = express()
var jsonParser = bodyParser.json()

var date = new Date()
var hour = date.getHours()
var last = hour

global.metrics = {}

// return summation of metric values for key
app.get('/metric/:key/sum', function (req, res) {
  var value = 0
  key = req.params.key

  if (global.metrics[key] !== undefined) {
    value = global.metrics[key]
  }

  response = {
    "value": value
  }

  console.log("SUM " + key + ": " + value)
  res.send(response)
})

// log new metric value for key
app.post('/metric/:key', jsonParser, function (req, res) {
  if (req.body.value) {
    var value = req.body.value
    key = req.params.key

    if (global.metrics[key] === undefined) {
      global.metrics[key] = value
    } else {
      global.metrics[key] += value
    }
  }

  console.log("LOG " + key + ": " + value)
  res.status(200)
  res.send()
})

app.listen(3000, () => console.log('Sum Metric Service listening on port 3000 😎'))

