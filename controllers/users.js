require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');
const { сreated } = require('../errors/errorCodes');

const Conflict = require('../errors/conflict');
const NotFound = require('../errors/notFound');
const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/badRequest');
const {
  usersConflictText,
  BadRequestText,
  usersUnauthorizedText,
  usersWrongLoginOrPasswordText,
  usersIdNotFoundText
} = require('../errors/errorText');

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
          next(new Conflict(usersConflictText));
        } else if (error.name === 'ValidationError') {
          next(new BadRequest(BadRequestText));
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
        throw new Unauthorized(usersUnauthorizedText);
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return next(new Unauthorized(usersWrongLoginOrPasswordText));
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
// module.exports.getUserById = (req, res, next) => {
//   userSchema
//     .findById(req.params.userId)
//     .then((user) => {
//       if (!user) {
//         throw new NotFound(usersIdNotFoundText);
//       }
//       return res.send(user);
//     })
//     .catch(next);
// };

// редактировать профиль
module.exports.editProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;

  userSchema.findByIdAndUpdate(_id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound(usersIdNotFoundText);
      }
      return res.send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(
          new BadRequest(BadRequestText)
        );
      } else next(error);
    });
};

// получаем текущего пользователя
module.exports.getUserById = (req, res, next) => {
  // const { _id } = req.user;

  userSchema
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по данному _id не найден');
      }
      return res.send(user);
    })
    .catch(next);
};
