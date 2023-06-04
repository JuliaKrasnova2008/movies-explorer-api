const usersRouter = require('express').Router();
const {
  getUserById,
  editProfile,
} = require('../controllers/users');
const { getUserValid, editUserValid } = require('../middlewares/validation');

usersRouter.get('/me', getUserValid, getUserById);
usersRouter.patch('/me', editUserValid, editProfile);

module.exports = usersRouter;
