const request = require('supertest')
const { assert } = require('chai')
const app = require('../app')
const { User, Project, sequelize } = require('../models')

describe('/api/projects/*', function() {
  let users

  before(async function() {
    await sequelize.sync({ force: true })
    users = await Promise.all([
      User.create({ username: 'demo', password: 'password' }),
      User.create({ username: 'demo2', password: 'password' })
    ])
  })

  afterEach(async function() {
    await Project.destroy({ where: {} })
  })

  after(async function() {
    await User.destroy({ where: {} })
  })

  describe('GET /api/projects', function() {
    it('Unauthorized', async function() {
      await request(app)
        .get('/api/projects')
        .set('Accept', 'application/json')
        .expect(401)
    })

    it('empty projects', async function() {
      await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200, [])
    })

    it('get only my projects', async function() {
      await Project.create({ UserId: users[0].id, title: 'Project one' })
      await Project.create({ UserId: users[1].id, title: 'Project another' })

      await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.equal(response.body.length, 1)
        })
    })

    it('create project', async function() {
      await request(app)
        .post('/api/projects')
        .send({
          title: 'Project One',
          description: 'Some stuff about Project One'
        })
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.propertyVal(response.body, 'title', 'Project One')
          assert.propertyVal(response.body, 'description', 'Some stuff about Project One')
          assert.property(response.body, 'updatedAt')
          assert.property(response.body, 'createdAt')
        })
    })

    it('retrieve project', async function() {
      const project = await Project.create({ UserId: users[0].id, title: 'Project one' })

      await request(app)
        .get(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.propertyVal(response.body, 'id', project.id)
          assert.propertyVal(response.body, 'title', 'Project one')
          assert.property(response.body, 'updatedAt')
          assert.property(response.body, 'createdAt')
        })
    })

    it('try retrieve project from another user', async function() {
      const project = await Project.create({ UserId: users[1].id, title: 'Project one' })

      await request(app)
        .get(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('update project', async function() {
      const project = await Project.create({
        UserId: users[0].id,
        title: 'Project one',
        description: 'Some stuff about Project One'
      })

      await request(app)
        .put(`/api/projects/${project.id}`)
        .send({
          title: 'Project 1'
        })
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.propertyVal(response.body, 'title', 'Project 1')
          assert.notProperty(response.body, 'description')
        })
    })

    it('delete project', async function() {
      const project = await Project.create({
        UserId: users[0].id,
        title: 'Project one',
        description: 'Some stuff about Project One'
      })

      await request(app)
        .del(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(203)

      const count = await Project.count({ where: { UserId: users[0].id } })

      assert.equal(count, 0)
    })

    it('delete not my project', async function() {
      const project = await Project.create({ UserId: users[1].id, title: 'Project one' })

      await request(app)
        .del(`/api/projects/${project.id}`)
        .set('Authorization', `Bearer ${users[0].genToken()}`)
        .set('Accept', 'application/json')
        .expect(404)
    })
  })
})
