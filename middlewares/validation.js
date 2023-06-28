const REGEXP = /https?:\/\/(www\.)?[a-z0-9.-]{2,}\.[a-z]{2,}\/?[-._~:/?#[\]@!$&'()*+,;=]*/;

const URL_DB_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const { celebrate, Joi } = require('celebrate');

// auth
const singupValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const singinValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// movies
const addMovieValid = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGEXP),
    trailerLink: Joi.string().required().pattern(REGEXP),
    thumbnail: Joi.string().required().pattern(REGEXP),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const moviesIdValid = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required(),
  }),
});

// users
// const getUserValid = celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().length(24).hex().required(),
//   }),
// });

const editUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  REGEXP,
  URL_DB_DEV,
  singupValid,
  singinValid,
  addMovieValid,
  moviesIdValid,
  editUserValid
};
