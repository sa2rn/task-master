const { Router } = require('express')
const passport = require('passport')
const { list, retrieve, remove, update, create } = require('./projects.controller')

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))
router.get('/', list)
router.post('/', create)
router.get('/:projectId', retrieve)
router.put('/:projectId', update)
router.delete('/:projectId', remove)

module.exports = router
