const { Router } = require('express')
const passport = require('passport')
const { register, update, aboutMe, login } = require('./users.controller')

const router = Router()

router.post('/login', passport.authenticate('local', { session: false }), login)
router.post('/register', register)
router.use(passport.authenticate('jwt', { session: false }))
router.get('/me', aboutMe)
router.put('/me', update)

module.exports = router
