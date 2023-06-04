const authRouter = require('express').Router();
const { login, addUser } = require('../controllers/users');
const { singupValid, singinValid } = require('../middlewares/validation');

authRouter.post('/signup', singupValid, addUser);
authRouter.post('/signin', singinValid, login);

module.exports = authRouter;
