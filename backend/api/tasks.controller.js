const { Task } = require('../models')
const createError = require('http-errors')

// TODO: add validation
function createListQuery(req) {
  const dbQuery = {
    where: { UserId: req.user.id },
    order: []
  }

  const { ProjectId, status, orderBy, orderDir } = req.query

  if (ProjectId) {
    dbQuery.where.ProjectId = ProjectId
  }
  if (status) {
    dbQuery.where.status = status
  }
  if (orderBy) {
    const order = [orderBy]
    if (orderDir) {
      order.push(orderDir)
    }
    dbQuery.order.push(order)
  }

  return dbQuery
}

async function findTask(req, res, next) {
  try {
    const task = await Task.findOne({
      where: { id: req.params.taskId, UserId: req.user.id }
    })

    if (task) {
      req.task = task
      next()
    } else {
      next(createError(404))
    }
  } catch (err) {
    next(err)
  }
}

exports.list = async(req, res, next) => {
  try {
    const query = createListQuery(req)
    const tasks = await Task.findAll(query)

    return res.json(tasks)
  } catch (err) {
    next(err)
  }
}

exports.retrieve = [
  findTask,
  (req, res) => {
    res.json(req.task)
  }
]

exports.remove = [
  findTask,
  async(req, res, next) => {
    try {
      await Task.destroy({
        where: { id: req.task.id }
      })

      return res.status(203).end()
    } catch (err) {
      next(err)
    }
  }
]

exports.create = async(req, res, next) => {
  try {
    const { title, description, ProjectId, priority, status, deadline } = req.body
    const task = await Task.create({
      UserId: req.user.id,
      ProjectId,
      title,
      description,
      priority,
      status,
      deadline
    })

    return res.status(200).json(task)
  } catch (err) {
    next(err)
  }
}

exports.update = [
  findTask,
  async(req, res, next) => {
    try {
      const { task } = req
      const { title, description, ProjectId, priority, status, deadline } = req.body

      task.set({
        ProjectId,
        title,
        description,
        priority,
        status,
        deadline
      })
      await task.save()

      return res.status(200).json(task)
    } catch (err) {
      next(err)
    }
  }
]
