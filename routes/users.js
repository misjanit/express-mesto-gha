const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexpLink } = require('../utils/constants');

const {
  getUsers,
  findUser,
  getUserInfo,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

// GET-запрос возвращает всех пользователей из базы данных;
router.get('/', getUsers);

// GET-запрос возвращает пользователя по переданному _id
router.get('/me', getUserInfo);

// GET-запрос возвращает информацию о текущем пользователе
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), findUser);

// PATCH-запрос обновляет информацию о пользователе.
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

// PATCH-запрос обновляет аватар пользователя.
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regexpLink),
  }),
}), updateAvatar);

module.exports = router;
