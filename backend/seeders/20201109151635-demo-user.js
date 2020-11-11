'use strict'
const crypt = require('../utils/crypt')

function fakeArray(fn) {
  return new Array(10).fill(0).map((_, index) => fn(index))
}

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      username: 'demo',
      password: crypt.hashPassword('password'),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    const [users] = await queryInterface.sequelize.query(
      'SELECT * from Users;'
    )

    await queryInterface.bulkInsert('Projects', fakeArray((index) => {
      return {
        UserId: users[0].id,
        title: `Project ${index}`,
        description: `Some stuff about Project ${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    const [projects] = await queryInterface.sequelize.query(
      'SELECT * from Projects;'
    )

    await queryInterface.bulkInsert('Tasks', fakeArray((index) => {
      return {
        UserId: users[0].id,
        ProjectId: projects[0].id,
        title: `Task ${index}`,
        description: `Some stuff about Task ${index}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
