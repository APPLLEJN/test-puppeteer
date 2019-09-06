const express = require('express')
const requestIp = require('request-ip')

const app = express()
app.use(requestIp.mw())

app.use(function(req, res, next) {
    console.log(req.clientIp)
    const ip = req.clientIp;
    next()
});

function start () {
    app.listen(9090, function () {
      console.log(`link to: http://localhost:9090`)
    })
}

start()
