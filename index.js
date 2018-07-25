const express = require('express')
const bodyParser = require('body-parser')

var app = express()
var jsonParser = bodyParser.json()

global.metrics = {}

// return summation of metric values for key
app.get('/metric/:key/sum', function (req, res) {
  var key = req.params.key
  var sum = 0

  if (global.metrics[key] !== undefined) {
    var initialValue = 0
    sum = global.metrics[key].reduce(function (accumulator, currentValue) {
      var now = ((new Date).getTime()/1000).toFixed()
      if (now - currentValue.time < 3600) {
        accumulator += currentValue.value
      }
      return accumulator
    }, initialValue)
  } else {
    sum = 0
  }

  response = {
    "value": sum
  }

  console.log("SUM " + key + ": " + sum)
  res.send(response)
})

// log new metric value for key
app.post('/metric/:key', jsonParser, function (req, res) {
  if (req.body.value) {
    var key = req.params.key
    var time = ((new Date).getTime()/1000).toFixed()
    var value = req.body.value

    if (global.metrics[key] === undefined) {
      global.metrics[key] = []
    }

    global.metrics[key].push({ time: time, value: value })
  }

  console.log("LOG " + key + ": " + value)
  console.log(global.metrics[key])
  res.status(200)
  res.send()
})

app.listen(3000, () => console.log('Sum Metric Service listening on port 3000 😎'))

