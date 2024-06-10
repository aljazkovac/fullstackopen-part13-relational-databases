const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')
class Blog extends Model {}

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isWithinRange(value) {
               const currentYear = new Date().getFullYear()
               if (value < 1991 || value > currentYear) {
                   throw new Error(`Year must be between 1991 and ${currentYear}.`)
               }
            }
        }
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog'
})

module.exports = Blog
