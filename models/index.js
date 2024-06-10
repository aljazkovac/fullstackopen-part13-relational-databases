const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const ReadingListMembership = require('./readingListMembership')

User.hasMany(Blog)
Blog.belongsTo(User)
Blog.belongsToMany(ReadingList, { through: ReadingListMembership })
ReadingList.belongsToMany(Blog, { through: ReadingListMembership })
User.hasMany(ReadingList)
ReadingList.belongsTo(User)

module.exports = {
    Blog, User, ReadingList, ReadingListMembership
}