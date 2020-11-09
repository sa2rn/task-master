/* eslint-disable space-before-function-paren */
'use strict'
const {
  Model,
  Op
} = require('sequelize')
const crypt = require('../utils/crypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Project, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
      User.hasMany(models.Task, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
      // define association here
    }

    verifyPassword(value) {
      return crypt.verifyPassword(value, this.passwordHash)
    }

    genToken() {
      return crypt.generateToken(this)
    }

    toJSON() {
      const ret = super.toJSON()
      delete ret.passwordHash
      delete ret.password
      return ret
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 100],
          msg: 'Allow value with length between 3 and 100'
        },
        async isUnique(value) {
          const count = await User.count({ where: { username: value, id: { [Op.ne]: this.id } } })
          if (count > 0) throw new Error('username already in use')
        }
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('password', value)
        this.setDataValue('passwordHash', crypt.hashPassword(value))
      },
      validate: {
        len: {
          args: [5, 100],
          msg: 'Allow value with length between 5 and 100'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User'
  })

  return User
}
