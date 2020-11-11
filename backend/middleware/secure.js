const jwt = require('jsonwebtoken')
const { User } = require('../models')

module.exports = async(req, res, next) => {
  function fail() {
    res.status(401).end('Unauthorized')
  }

  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    return fail()
  }

  const token = authorizationHeader.replace(/^bearer /i, '')

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    const user = await User.findByPk(decoded.id)

    if (user) {
      req.user = user
      next()
    } else {
      fail()
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      fail()
    } else {
      next(err)
    }
  }
}
