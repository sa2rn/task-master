'use strict'
const {
  Model
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Project.belongsTo(models.User)
      Project.hasMany(models.Task, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    }
  }

  Project.init({
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
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Project'
  })

  return Project
}
