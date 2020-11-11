const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const express = require('express')
const createError = require('http-errors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const api = require('./api')
const logErrors = require('./middleware/log-errors')
const handleValidationErrors = require('./middleware/handle-validation-errors')

const app = express()
app.set('port', parseInt(process.env.PORT || 3001))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))
}

app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'))
app.use(bodyParser.json())
app.use('/api', api)
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
  })
}

app.use((req, res, next) => {
  next(createError(404))
})
app.use(handleValidationErrors)
app.use(logErrors)
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(status)

  if (req.is('json') || req.accepts('json') || req.xhr) {
    res.json({ error: message })
  } else {
    res.send(message)
  }
})

module.exports = app

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`Listen on http://localhost:${app.get('port')} on ${process.env.NODE_ENV ?? 'development'} environment`)
  })
}
