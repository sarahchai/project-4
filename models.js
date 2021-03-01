const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/code_the_rant', {
  dialect: 'postgres'
});


// Create models here
const User = sequelize.define('user', {
  username: { type: Sequelize.STRING, unique: true },
  email: { type: Sequelize.STRING, unique: true },
  passwordDigest: Sequelize.STRING
})

const Post = sequelize.define('post', {
  content: Sequelize.TEXT
})

const Comment = sequelize.define('comment', {
  code: Sequelize.TEXT
})

const UserPostLike = sequelize.define('userPostLike')

const UserCommentLike = sequelize.define('userCommentLike')


User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);


User.belongsToMany(Post, { through: UserPostLike, as: 'LikedPosts' });
Post.belongsToMany(User, { through: UserPostLike, as: 'PostLikedUsers'  });

User.belongsToMany(Comment, { through: UserCommentLike, as: 'LikedComments' });
Comment.belongsToMany(User, { through: UserCommentLike, as: 'CommentLikedUsers' });


module.exports = {
  // Export models
  User,
  Post,
  Comment,
  UserPostLike,
  UserCommentLike,
  sequelize: sequelize
};