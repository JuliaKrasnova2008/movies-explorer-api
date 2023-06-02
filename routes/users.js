const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserById,
  editProfile,
} = require('../controllers/users');

usersRouter.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editProfile);

module.exports = usersRouter;
