const router = require('express').Router();

const {
  getUsers,
  findUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

// GET-запрос возвращает всех пользователей из базы данных;
// POST-запрос создаёт пользователя с переданными в теле запроса */
router.get('/', getUsers);

// GET-запрос возвращает пользователя по переданному _id
router.get('/:userId', findUser);

// PATCH-запрос обновляет информацию о пользователе.
router.patch('/me', updateUserInfo);

// GET-запрос возвращает информацию о текущем пользователе
router.get('/me');

// PATCH-запрос обновляет аватар пользователя.
router.patch('/me/avatar', updateAvatar);

module.exports = router;
