const User = require('../models/user');
const { ObjectId } = require('mongoose').Types;
const VALIDATION_ERROR = 400;
const NOTFOUND_ERROR = 404; // пользователь не найден
const SERVER_ERROR = 500; // ошибка по умолчанию

// Получаем объект всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    return res.status(200).send({ users })
  })
  .catch((err) => {
    if (err.name === 'Error') {
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    }
  })
}

// Создаем нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({name, about, avatar})
    .then((user) => {
      return res.status(200).send({ user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные' })
      }
      if (err.name === 'Error') {
        return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
      }
    });
};

// Находим пользователя по id
module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла шибка' });
      }
    });
};

// Обновляем информацию о пользователе (имя или описание)
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, about }, {new: true, runValidators: true })
    .then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные' })
    }
    if (err.name === 'Error') {
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    }
  })
}

// Обновляем аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findOneAndUpdate(id, { avatar }, { new: true, runValidators: true, upsert: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ user })
      } else {
        return res.status(NOTFOUND_ERROR).send({ message: 'Пользователь не найден' })
      }
  })
    .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные' })
    }
    if (err.name === 'Error') {
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    }
  })
}