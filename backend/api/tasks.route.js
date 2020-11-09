const { Router } = require('express')
const passport = require('passport')
const { list, retrieve, remove, update, create } = require('./tasks.controller')

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))
router.get('/', list)
router.post('/', create)
router.get('/:taskId', retrieve)
router.put('/:taskId', update)
router.delete('/:taskId', remove)

module.exports = router
