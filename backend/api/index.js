const projects = require('./projects.route.js')
const tasks = require('./tasks.route.js')
const users = require('./users.route.js')
const { Router } = require('express')

const router = Router()

router.use('/projects', projects)
router.use('/tasks', tasks)
router.use('/users', users)

module.exports = router
