const { Router } = require('express')
const secure = require('../middleware/secure')
const { register, update, aboutMe, login } = require('./users.controller')

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.use(secure)
router.get('/me', aboutMe)
router.put('/me', update)

module.exports = router
