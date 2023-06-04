require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const router = require('./routes');
const cors = require('./middlewares/cors');
const { URL_DB_DEV } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const defaultErr = require('./errors/defaultErr');
const NotFound = require('./errors/notFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, addUser } = require('./controllers/users');

const { PORT = 3000, NODE_ENV, URL_DB_PROD } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? URL_DB_PROD : URL_DB_DEV);

// app.use(cors({ origin: '*', optionsSuccessStatus: 200, }));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  addUser
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

app.use(auth);
app.use(router);

app.use((req, res, next) => {
  next(new NotFound('Порта не существует'));
});

app.use(errorLogger);
app.use(errors());

app.use(defaultErr);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
