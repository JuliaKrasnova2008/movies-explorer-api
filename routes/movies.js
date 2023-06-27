const moviesRouter = require('express').Router();
const {
  getMovie,
  deleteMovie,
  addMovie,
} = require('../controllers/movies');
const { addMovieValid, moviesIdValid } = require('../middlewares/validation');

moviesRouter.get('/', getMovie);
moviesRouter.post('/', addMovieValid, addMovie);
moviesRouter.delete('/:movieId', moviesIdValid, deleteMovie);

module.exports = moviesRouter;
