const router = require('express').Router();

const { getUsers, findUser, createUser, updateUserInfo, updateAvatar } = require('../controllers/users');

// GET-запрос возвращает всех пользователей из базы данных;
// POST-запрос создаёт пользователя с переданными в теле запроса */
router.get('/users', getUsers);
router.post('/users', createUser);

// GET-запрос возвращает пользователя по переданному _id
router.get('/users/:userId', findUser);

// PATCH-запрос обновляет информацию о пользователе.
router.patch('/users/me', updateUserInfo);

// PATCH-запрос обновляет аватар пользователя.
router.patch('/users/me/avatar', updateAvatar)

