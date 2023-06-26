const usersRouter = require('express').Router();
const {
  getUserById,
  editProfile,
} = require('../controllers/users');
const { editUserValid } = require('../middlewares/validation');

usersRouter.get('/me', getUserById);
usersRouter.patch('/me', editUserValid, editProfile);

module.exports = usersRouter;
