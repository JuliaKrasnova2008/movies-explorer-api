const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovie,
  deleteMovie,
  addMovie,
} = require('../controllers/movies');
const { REGEXP } = require('../middlewares/validation');

moviesRouter.get('/', getMovie);

moviesRouter.post(
  '/',
  celebrate({
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
  }),
  addMovie
);

moviesRouter.delete(
  '/:moviesId',
  celebrate({
    params: Joi.object().keys({
      moviesId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie
);

module.exports = moviesRouter;
