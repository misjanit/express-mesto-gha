const router = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
// GET-запрос возвращает все карточки из базы данных
// POST-запрос создает новую карточку по переданным параметрам.
router.get('/', getCards);
router.post('/', createCard);

// DELETE-запрос удаляет карточку по _id
router.delete('/:cardId', deleteCard);

// PUT-запрос добавляет лайк карточке.
// DELETE-запрос удаляет лайк с карточки.
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;