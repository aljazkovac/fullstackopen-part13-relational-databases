const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ReadingListMembership extends Model {}

ReadingListMembership.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' },
    },
    readingListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'readingList', key: 'id' },
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'readingListMembership'
})

module.exports = ReadingListMembership