const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ReadingList extends Model {}

ReadingList.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'readingList'
})

module.exports = ReadingList