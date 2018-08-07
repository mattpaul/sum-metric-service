const express = require('express')
const bodyParser = require('body-parser')

function initializeServer() {
  var app = express()
  var metrics = {}

  // return summation of metric values for key
  app.get('/metric/:key/sum', function (req, res) {
    var key = req.params.key
    var sum = 0

    if (metrics[key] !== undefined) {
      var initialValue = []
      var now = ((new Date).getTime()/1000).toFixed()

      // reduce array of metrics for this key to those in the last hour only
      metrics[key] = metrics[key].reduce(function (accumulator, currentValue) {
        if (now - currentValue.time < 3600) {
          accumulator.push(currentValue)
        }
        return accumulator
      }, initialValue)

      // calculate sum of remaining metric values
      sum = metrics[key].reduce(function (accumulator, currentValue) {
        return accumulator += currentValue.value
      }, 0)

      console.log("metrics[key] " + key + ": " + metrics[key])
      console.log("SUM " + key + ": " + sum)
      res.send({ "value": sum })
    } else {
      // reject invalid request due to missing URL params
      res.status(404).send('{"error": "metric key undefined"}')
    }
  })

  // log new metric value for key
  app.post('/metric/:key', bodyParser.json(), function (req, res) {
    if (req.body.value) {
      var key = req.params.key
      var time = ((new Date).getTime()/1000).toFixed()
      var value = req.body.value

      // allocate new array for this key's metrics
      if (metrics[key] === undefined) {
        metrics[key] = []
      }

      // push` new metric onto the array
      metrics[key].push({ time: time, value: value })

      console.log("LOG " + key + ": " + value)
      console.log(metrics[key])
      res.status(200).send("{}")
    } else {
      // reject invalid request due to missing body params
      res.status(400).send('{"error": "invalid request; value parameter missing"}')
    }
  })

  return app;
}

app = initializeServer();
app.listen(3000, () => console.log('Sum Metric Service listening on port 3000 😎'))

