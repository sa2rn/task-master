const { Router } = require('express')
const secure = require('../middleware/secure')
const { list, retrieve, remove, update, create } = require('./tasks.controller')

const router = Router()

router.use(secure)
router.get('/', list)
router.post('/', create)
router.get('/:taskId', retrieve)
router.put('/:taskId', update)
router.delete('/:taskId', remove)

module.exports = router
