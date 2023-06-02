const movieSchema = require('../models/movie');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');

// получаем movie
module.exports.getMovie = (req, res, next) => {
  movieSchema
    .find({ owner: req.user._id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильмы не найдены.');
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
        next(new BadRequest('Некорректные данные при создании фильма'));
      } else {
        next(error);
      }
    });
};

// удаляем movie
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  movieSchema.findById({ _id: movieId })
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм с данным _id не найден');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new Forbidden('Доступ запрещен');
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
        next(new BadRequest('Некорректные данные.'));
      } else {
        next(error);
      }
    });
};



