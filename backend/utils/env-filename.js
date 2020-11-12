let envFilename

if (process.env.NODE_ENV === 'production') {
  envFilename = '.env.prod'
} else if (process.env.NODE_ENV === 'test') {
  envFilename = '.env.test'
} else if (process.env.NODE_ENV === 'development') {
  envFilename = '.env.dev'
} else {
  envFilename = '.env'
}

module.exports = envFilename
