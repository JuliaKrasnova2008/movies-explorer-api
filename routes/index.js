const express = require('express');
const usersRouter = require('./users');
const moviesRouter = require('./movies');

const router = express.Router();

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
