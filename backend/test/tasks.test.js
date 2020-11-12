const request = require('supertest')
const { assert } = require('chai')
const app = require('../app')
const { User, Project, Task, sequelize } = require('../models')

describe('/api/tasks/*', function() {
  let users
  let projects

  before(async function() {
    await sequelize.sync({ force: true })
    users = await Promise.all([
      User.create({ username: 'demo', password: 'password' }),
      User.create({ username: 'demo2', password: 'password' })
    ])
    projects = await Promise.all([
      Project.create({ UserId: users[0].id, title: 'Project one' }),
      Project.create({ UserId: users[0].id, title: 'Project two' }),
      Project.create({ UserId: users[1].id, title: 'Project three' }),
      Project.create({ UserId: users[1].id, title: 'Project four' })
    ])
  })

  after(async function() {
    await Task.destroy({ where: {} })
    await Project.destroy({ where: {} })
    await User.destroy({ where: {} })
  })

  afterEach(async function() {
    await Task.destroy({ where: {} })
  })

  describe('GET /api/tasks', function() {
    it('Unauthorized', async function() {
      await request(app)
        .get('/api/tasks')
        .set('Accept', 'application/json')
        .expect(401)
    })

    it('empty tasks', async function() {
      await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200, [])
    })

    it('filtered by project', async function() {
      const tasks = await Promise.all([
        Task.create({ UserId: users[0].id, ProjectId: projects[0].id, title: 'Task one' }),
        Task.create({ UserId: users[0].id, ProjectId: projects[1].id, title: 'Task two' }),
        Task.create({ UserId: users[1].id, ProjectId: projects[3].id, title: 'Task three' })
      ])

      await request(app)
        .get(`/api/tasks?ProjectId=${projects[0].id}`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.equal(response.body.length, 1)
          assert.equal(response.body[0].id, tasks[0].id)
        })
    })

    it('filtered by status', async function() {
      const tasks = await Promise.all([
        Task.create({ UserId: users[0].id, ProjectId: projects[0].id, title: 'Task one' }),
        Task.create({ UserId: users[0].id, ProjectId: projects[0].id, title: 'Task two', status: 'done' })
      ])

      await request(app)
        .get(`/api/tasks?ProjectId=${projects[0].id}&status=new`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.equal(response.body.length, 1)
          assert.propertyVal(response.body[0], 'status', 'new')
          assert.propertyVal(response.body[0], 'id', tasks[0].id)
        })
    })
  })

  describe('POST /api/tasks', function() {
    it('create task', async function() {
      await request(app)
        .post('/api/tasks')
        .send({
          ProjectId: projects[0].id,
          title: 'Task One',
          description: 'Some stuff about Task One'
        })
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.propertyVal(response.body, 'title', 'Task One')
          assert.propertyVal(response.body, 'ProjectId', projects[0].id)
          assert.propertyVal(response.body, 'description', 'Some stuff about Task One')
          assert.property(response.body, 'updatedAt')
          assert.property(response.body, 'createdAt')
        })
    })

    it('invalid fields', async function() {
      await request(app)
        .post('/api/tasks')
        .send({
          ProjectId: projects[0].id,
          title: '',
          status: 'unknown',
          priority: -1,
          deadline: 'unknown'
        })
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(400, {
          errors: {
            title: 'Allow value with length between 3 and 100',
            status: 'Only allow \'new\' or \'done\'',
            priority: 'Only allow value >= 0',
            deadline: 'Only allow date'
          }
        })
    })
  })

  describe('GET /api/tasks/:taskId', function() {
    it('retrieve task', async function() {
      const task = await Task.create({ UserId: users[0].id, ProjectId: projects[0].id, title: 'Task one' })

      await request(app)
        .get(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.propertyVal(response.body, 'id', task.id)
          assert.propertyVal(response.body, 'ProjectId', projects[0].id)
          assert.propertyVal(response.body, 'title', 'Task one')
          assert.propertyVal(response.body, 'priority', 0)
          assert.propertyVal(response.body, 'status', 'new')
          assert.property(response.body, 'updatedAt')
          assert.property(response.body, 'createdAt')
        })
    })
  })

  describe('PUT /api/tasks/:taskId', function() {
    it('update task', async function() {
      const task = await Task.create({ UserId: users[0].id, ProjectId: projects[0].id, title: 'Task one' })

      await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({
          ProjectId: projects[1].id,
          title: 'Task 1',
          priority: 5,
          status: 'done'
        })
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.propertyVal(response.body, 'id', task.id)
          assert.propertyVal(response.body, 'ProjectId', projects[1].id)
          assert.propertyVal(response.body, 'title', 'Task 1')
          assert.propertyVal(response.body, 'priority', 5)
          assert.propertyVal(response.body, 'status', 'done')
          assert.property(response.body, 'updatedAt')
          assert.property(response.body, 'createdAt')
        })
    })
  })

  describe('DELETE /api/tasks/:taskId', function() {
    it('delete task', async function() {
      const task = await Task.create({ UserId: users[0].id, ProjectId: projects[0].id, title: 'Task one' })

      await request(app)
        .del(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(203)

      const count = await Task.count({ where: { UserId: users[0].id } })

      assert.equal(count, 0)
    })

    it('try to delete not my task', async function() {
      const task = await Task.create({ UserId: users[1].id, ProjectId: projects[3].id, title: 'Task one' })

      await request(app)
        .del(`/api/tasks/${task.id}`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(404)
    })
  })
})
