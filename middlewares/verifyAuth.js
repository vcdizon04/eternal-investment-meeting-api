const jwt = require('jsonwebtoken');
const {
  errorMessage, status
} = require('../helpers/status');
const {User, Category, UserCategory, Post, Resource} = require('../models');

/**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */

module.exports = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    errorMessage.error = 'Token header not provided';
    return res.status(status.bad).send(errorMessage);
  }
  try {
    const decoded =  jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findByPk(decoded.user_id, {
      include: [
      {
        model: Category,
        as: 'user_categories',
        include: [{
          model: Post,
          as: 'category_posts',
          include: ['post_user', 'post_category', 'post_replies']
        }]
      },
      'user_posts',
      'user_tags'
    ]
    });
    

    if(!user) {
      errorMessage.error = 'Authentication Failed';
      return res.status(status.unauthorized).send(errorMessage);
    }
    let categories = await Category.findAll({
      include: ['category_tags']
    })
    categories = categories.filter(category => category.category_tags.findIndex(tag => user.user_tags.findIndex(userTag => userTag.id == tag.id) > -1  ) > -1); 
    user.setDataValue('user_categories', categories)

    const latestResources = await Resource.findAll({
      order: [
        ['createdAt', 'ASC']
      ],
      limit: 3
    })
    user.setDataValue('latest_resources', latestResources)
    req.user = user;
    // res.json( req.user );
    next();
  } catch (error) {
    console.log(error)
    errorMessage.error = 'Authentication Failed';
    return res.status(status.unauthorized).send(errorMessage);
  }
};
