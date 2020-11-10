const { Project } = require('../models')
const createError = require('http-errors')

async function findProject(req, res, next) {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId, UserId: req.user.id }
    })

    if (project) {
      req.project = project
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
    const projects = await Project.findAll({
      where: { UserId: req.user.id },
      order: [
        ['title', 'ASC']
      ]
    })

    return res.json(projects)
  } catch (err) {
    next(err)
  }
}

exports.retrieve = [
  findProject,
  (req, res) => {
    res.json(req.project)
  }
]

exports.remove = [
  findProject,
  async(req, res, next) => {
    try {
      await Project.destroy({
        where: { id: req.project.id }
      })

      return res.status(203).end()
    } catch (err) {
      next(err)
    }
  }
]

exports.create = async(req, res, next) => {
  try {
    const { title, description } = req.body
    const project = await Project.create({
      UserId: req.user.id,
      title,
      description
    })

    return res.status(200).json(project)
  } catch (err) {
    next(err)
  }
}

exports.update = [
  findProject,
  async(req, res, next) => {
    try {
      const { project } = req
      const { title, description } = req.body
      project.set({
        title,
        description
      })
      await project.save()

      return res.status(200).json(project)
    } catch (err) {
      next(err)
    }
  }
]
