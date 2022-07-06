const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
// const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { regexpLink, NOTFOUND_ERROR } = require('./utils/constants');
// const NotFoundError = require('./errors/not-found-error');
// const appErrors = require('./errors/app-errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// подключаем мидлвары, роуты и всё остальное...

app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexpLink),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use(errors());

app.use((req, res, next) => {
  res.status(NOTFOUND_ERROR).send({ message: 'Страница не найдена' });
  next();
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(PORT, () => {
});
