const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.hashPassword = (value) => bcrypt.hashSync(value, 10)
exports.verifyPassword = (plainPassword, hash) => bcrypt.compareSync(plainPassword, hash)
exports.generateToken = (user) => jwt.sign({ id: user.id, username: user.username }, process.env.SECRET)
