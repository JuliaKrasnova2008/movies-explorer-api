const movieSchema = require('../models/movie');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const {
  movieNotFoundText,
  movieIdNotFoundText,
  BadRequestText,
  movieForbiddenText,
} = require('../errors/errorText');

// получаем movie
module.exports.getMovie = (req, res, next) => {
  movieSchema
    .find({ owner: req.user._id })
    .then((movie) => {
      if (!movie) {
        throw new NotFound(movieNotFoundText);
      }
      return res.send(movie);
    })
    .catch(next);
};

// создаем movie
module.exports.addMovie = (req, res, next) => {
  movieSchema.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest(BadRequestText));
      } else {
        next(error);
      }
    });
};

// удаляем movie
module.exports.deleteMovie = (req, res, next) => {
  const { movieId: id } = req.params;

  movieSchema.findOne({ movieId: id })
    .then((movie) => {
      if (!movie) {
        throw new NotFound(movieIdNotFoundText);
      } else if (!movie.owner.equals(req.user._id)) {
        throw new Forbidden(movieForbiddenText);
      } else {
        movie.deleteOne()
          .then(() => res.status(200).send({ message: 'Фильм удален.' }))
          .catch((error) => {
            next(error);
          });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest(BadRequestText));
      } else {
        next(error);
      }
    });
};
