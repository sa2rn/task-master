const request = require('supertest')
const { assert } = require('chai')
const app = require('../app')
const { User, sequelize } = require('../models')

describe('/api/users/*', function() {
  before(async function() {
    await sequelize.sync({ force: true })
  })

  beforeEach(async function() {
    await User.create({ username: 'demo', password: 'password' })
  })

  afterEach(async function() {
    await User.destroy({ where: {} })
  })

  describe('POST /api/users/register', function() {
    it('successful login', async function() {
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'demo2',
          password: 'password'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert.nestedPropertyVal(response.body, 'user.username', 'demo2')
          assert.notNestedProperty(response.body, 'user.password')
          assert.notNestedProperty(response.body, 'user.passwordHash')
          assert.property(response.body, 'token')
        })
    })

    it('invalid username and password length', async function() {
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'd',
          password: 'p'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, {
          errors: {
            username: 'Allow value with length between 3 and 100',
            password: 'Allow value with length between 5 and 100'
          }
        })
    })

    it('duplicate username', async function() {
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'demo',
          password: 'password'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, {
          errors: {
            username: 'username already in use'
          }
        })
    })
  })

  describe('POST /api/users/login', function() {
    it('responds with json', async function() {
      await request(app)
        .post('/api/users/login')
        .send({
          username: 'demo',
          password: 'password'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          assert.nestedPropertyVal(response.body, 'user.username', 'demo')
          assert.notNestedProperty(response.body, 'user.password')
          assert.notNestedProperty(response.body, 'user.passwordHash')
          assert.property(response.body, 'token')
        })
    })

    it('invalid username or password', async function() {
      await request(app)
        .post('/api/users/login')
        .send({
          username: 'demo2',
          password: 'password'
        })
        .set('Accept', 'application/json')
        .expect(400, {
          errors: {
            username: 'Invalid username or password'
          }
        })
    })
  })
})
