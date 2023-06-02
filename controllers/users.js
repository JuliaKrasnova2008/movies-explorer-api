require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');
const { сreated } = require('../errors/errorCodes');

const Conflict = require('../errors/conflict');
const NotFound = require('../errors/notFound');
const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/badRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

// создать пользователя
module.exports.addUser = (req, res, next) => {
  const {
    email, password, name
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    userSchema.create({
      email, name, password: hash
    })
      .then((user) => res.status(сreated).send({
        email: user.email,
        name: user.name,
      }))
      .catch((error) => {
        if (error.code === 11000) {
          next(new Conflict('Такой пользователь уже существует'));
        } else if (error.name === 'ValidationError') {
          next(new BadRequest('Некорректные данные'));
        } else {
          next(error);
        }
      });
  })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userSchema.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Пользователь не найден');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return next(new Unauthorized('Не правильно указан логин или пароль'));
          }

          const token = jwt.sign(
            { _id: user._id },

            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' }
          );
          return res.send({ token });
        });
    })
    .catch(next);
};

// ищем по ID
module.exports.getUserById = (req, res, next) => {

  userSchema
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по данному _id не найден');
      }
      return res.send(user);
    })
    .catch(next);
};

// редактировать профиль
module.exports.editProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;

  userSchema.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по данному _id не найден');
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(
          new BadRequest('Переданы некорректные данные при обновлении профиля.')
        );
      } else next(error);
    });
};

