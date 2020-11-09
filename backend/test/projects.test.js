const request = require('supertest')
const { assert } = require('chai')
const app = require('../app')
const { User, Project } = require('../models')

describe('/api/projects/*', function() {
  let user

  beforeEach(async function() {
    user = await User.create({ username: 'demo', password: 'password' })
  })

  afterEach(async function() {
    await User.destroy({ where: {} })
  })

  // beforeEach(async function() {
  //   await User.create({ username: 'demo', password: 'password' })
  // })

  // afterEach(async function() {
  //   await User.destroy({ where: {} })
  // })

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
        .set('Authorization', `Bearer ${user.genToken()}`)
        .set('Accept', 'application/json')
        .expect(200, [])
    })

    it('one project', async function() {
      await Project.create({ UserId: user.id, title: 'Project one' })
      await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${user.genToken()}`)
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
        .set('Authorization', `Bearer ${user.genToken()}`)
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
      const project = await Project.create({ UserId: user.id, title: 'Project one' })

      await request(app)
        .get(`/api/projects/${project.id}`)
        .send({
          title: 'Project One',
          description: 'Some stuff about Project One'
        })
        .set('Authorization', `Bearer ${user.genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.propertyVal(response.body, 'id', project.id)
          assert.propertyVal(response.body, 'title', 'Project one')
          assert.property(response.body, 'updatedAt')
          assert.property(response.body, 'createdAt')
        })
    })

    it('update project', async function() {
      const project = await Project.create({
        UserId: user.id,
        title: 'Project one',
        description: 'Some stuff about Project One'
      })

      await request(app)
        .put(`/api/projects/${project.id}`)
        .send({
          title: 'Project 1'
        })
        .set('Authorization', `Bearer ${user.genToken()}`)
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          assert.propertyVal(response.body, 'title', 'Project 1')
          assert.notProperty(response.body, 'description')
        })
    })
  })
})
