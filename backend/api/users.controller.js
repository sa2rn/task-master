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

exports.login = (req, res) => {
  const { user } = req
  res.json({ user: user, token: user.genToken() })
}
