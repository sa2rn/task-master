const request = require('supertest')
const app = require('../app')

describe('POST /404', function() {
  it('responds with json', async function() {
    await request(app)
      .post('/404')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, {
        error: 'Not Found'
      })
  })
})
