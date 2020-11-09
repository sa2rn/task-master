const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { User } = require('./models')

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async function(username, password, done) {
  try {
    const user = await User.findOne({ where: { username } })

    if (!user) return done(null, false)
    if (!user.verifyPassword(password)) return done(null, false)
    return done(null, user)
  } catch (err) {
    done(err)
  }
}))

passport.use(new JwtStrategy({
  secretOrKey: process.env.SECRET || 'secret',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async function(payload, done) {
  try {
    const user = await User.findByPk(payload.id)
    if (user) return done(null, user)
    return done(null, false)
  } catch (err) {
    done(err)
  }
}))

module.exports = {
  passport
}
