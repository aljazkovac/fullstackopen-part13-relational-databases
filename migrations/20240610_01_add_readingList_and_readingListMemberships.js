const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('reading_lists', {
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
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        })
        // The join/through/connecting table.
        await queryInterface.createTable('reading_list_memberships', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            // In migration files, the fields are defined in snake case form.
            // In model files, the same fields are defined in camel case.
            blog_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // This is actually a reference to the table name, not the model name!
                references: { model: 'blogs', key: 'id' },
            },
            reading_list_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // This is actually a reference to the table name, not the model name!
                references: { model: 'reading_lists', key: 'id' },
            },
        })
        await queryInterface.addColumn('reading_lists', 'user_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('reading_lists')
        await queryInterface.dropTable('reading_list_memberships')
    },
}