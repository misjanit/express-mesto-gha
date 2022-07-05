const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const appErrors = require('../errors/app-errors');
const AuthError = require('../errors/auth-error');
const BadRequestError = require('../errors/bad-request-error');
const EmailError = require('../errors/email-error');
const NotFoundError = require('../errors/not-found-error');

// Получаем объект всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

// Логинимся
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new AuthError(appErrors.ERROR_LOGIN);
      }
      return next(err);
    });
};

// Создаем нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.send({
            _id: user._id,
            name,
            about,
            avatar,
            email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            throw new EmailError(appErrors.ERROR_EMAIL_ALREADY_USED);
          }
          if (err.name === 'ValidationError') {
            throw new BadRequestError(appErrors.ERROR_BAD_REQUEST);
          }
          return next(err);
        });
    });
};

// Находим пользователя по id
module.exports.findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(appErrors.ERROR_USER_NOT_FOUND);
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError(appErrors.ERROR_USER_NOT_FOUND);
      }
      return next(err);
    });
};

// Получаем информацию о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(appErrors.ERROR_USER_NOT_FOUND);
      }
      return res.send({ user });
    })
    .catch(next);
};

// Обновляем информацию о пользователе (имя или описание)
module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(appErrors.ERROR_USER_NOT_FOUND);
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError(appErrors.ERROR_INCORRECT_NEW_USER_PARAMS);
      }
      return next(err);
    });
};

// Обновляем аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findOneAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(appErrors.ERROR_USER_NOT_FOUND);
      }
      return res.send({ avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError(appErrors.ERROR_BAD_REQUEST);
      }
      return next(err);
    });
};

/* .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return res.status(200).send({ message: 'Успешно' }); // нужен ли тут return?
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(401).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
    */
