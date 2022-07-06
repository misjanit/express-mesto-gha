const Card = require('../models/card');

const appErrors = require('../errors/app-errors');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const DeleteError = require('../errors/delete-error');

// Получаем объект из всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

// Создаем карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(appErrors.ERROR_INCORRECT_NEW_CARD_PARAMS);
      }
      return next(err);
    });
};

// Удалить карточку
module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(appErrors.ERROR_CARD_NOT_FOUND);
      }
      if (userId !== card.owner.toString()) {
        throw new DeleteError(appErrors.ERROR_DELETE_CARD);
      } else {
        Card.findByIdAndRemove(cardId)
          .then((result) => res.send({ result }))
          .catch(next);
      }
    })
    .catch(next);
};

// Лайкнуть
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(appErrors.ERROR_CARD_NOT_FOUND);
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError(appErrors.ERROR_INCORRECT_NEW_CARD_PARAMS);
      }
      return next(err);
    });
};

// Дизлайкнуть
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(appErrors.ERROR_CARD_NOT_FOUND);
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError(appErrors.ERROR_INCORRECT_LIKE_PARAMS);
      }
      return next(err);
    });
};
