'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.User)
      Task.belongsTo(models.Project)
    }
  }

  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 100],
          msg: 'Allow value with length between 3 and 100'
        }
      }
    },
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'new',
      validate: {
        isIn: {
          args: [['new', 'done']],
          msg: 'Only allow \'new\' or \'done\''
        }
      }
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          msg: 'Must be int type'
        },
        min: {
          args: [0],
          msg: 'Only allow value >= 0'
        },
        max: {
          args: [10],
          msg: 'Only allow value <= 10'
        }
      }
    },
    deadline: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          args: [true],
          msg: 'Only allow date'
        },
        isFutureDate(value) {
          if (value <= new Date()) {
            throw new Error('Deadline can\'t be less than the current date')
          }
        }
      }
    },
    isExpired: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.deadline) return false
        return this.deadline <= new Date()
      }
    },
    daysLeft: {
      type: DataTypes.VIRTUAL,
      get() {
        if (!this.deadline) return Number.MAX_SAFE_INTEGER
        return Math.ceil((this.deadline - new Date()) / 864e5)
      }
    }
  }, {
    sequelize,
    modelName: 'Task'
  })

  return Task
}
