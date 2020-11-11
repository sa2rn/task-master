const { Router } = require('express')
const secure = require('../middleware/secure')
const { list, retrieve, remove, update, create } = require('./projects.controller')

const router = Router()

router.use(secure)
router.get('/', list)
router.post('/', create)
router.get('/:projectId', retrieve)
router.put('/:projectId', update)
router.delete('/:projectId', remove)

module.exports = router
