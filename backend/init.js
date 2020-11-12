const path = require('path')
const dotenv = require('dotenv')

let filename

if (process.env.NODE_ENV === 'production') {
  filename = '.env.prod'
} else if (process.env.NODE_ENV === 'test') {
  filename = '.env.test'
} else {
  filename = '.env.dev'
}

dotenv.config({ path: path.join(__dirname, '../', filename) })
