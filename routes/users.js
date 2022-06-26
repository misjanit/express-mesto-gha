const router = require('express').Router();

const {
  getUsers,
  findUser,
  createUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

// GET-запрос возвращает всех пользователей из базы данных;
// POST-запрос создаёт пользователя с переданными в теле запроса */
router.get('/', getUsers);
router.post('/', createUser);

// GET-запрос возвращает пользователя по переданному _id
router.get('/:userId', findUser);

// PATCH-запрос обновляет информацию о пользователе.
router.patch('/me', updateUserInfo);

// PATCH-запрос обновляет аватар пользователя.
router.patch('/me/avatar', updateAvatar);

module.exports = router;
