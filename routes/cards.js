const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');
// GET-запрос возвращает все карточки из базы данных
// POST-запрос создает новую карточку по переданным параметрам.
router.get('/cards', getCards);
router.post('/cards', createCard);

// DELETE-запрос удаляет карточку по _id
router.delete('/cards/:cardId', deleteCard);

// PUT-запрос добавляет лайк карточке.
// DELETE-запрос удаляет лайк с карточки.
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);