require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes');
const cors = require('./middlewares/cors');
const defaultErr = require('./errors/defaultErr');
const NotFound = require('./errors/notFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { URL_DB_DEV } = require('./middlewares/validation');
const { serverErrorText, serverNotFound } = require('./errors/errorText');

const { PORT = 3000, NODE_ENV, URL_DB_PROD } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? URL_DB_PROD : URL_DB_DEV);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(serverErrorText);
  }, 0);
});

app.use(router);

app.use((req, res, next) => {
  next(new NotFound(serverNotFound));
});

app.use(errorLogger);
app.use(errors());

app.use(defaultErr);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
