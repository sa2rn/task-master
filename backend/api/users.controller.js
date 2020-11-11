const { User } = require('../models')

exports.register = async(req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await User.create({ username, password })
    res.json({ user, token: user.genToken() })
  } catch (err) {
    next(err)
  }
}

exports.aboutMe = async(req, res, next) => {
  res.json(req.user)
}

exports.update = async(req, res, next) => {
  try {
    const { user, body: { username, password } } = req
    user.username = username
    user.password = password
    await user.save()
    res.json(user)
  } catch (err) {
    next(err)
  }
}

const invalidLogin = { errors: { username: 'Invalid username or password' } }

exports.login = async(req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json(invalidLogin)
    }

    const user = await User.findOne({ where: { username } })
    if (!user || !user.verifyPassword(password)) {
      return res.status(400).json({ errors: { username: 'Invalid username or password' } })
    }

    res.json({ user: user, token: user.genToken() })
  } catch (err) {
    next(err)
  }
}
