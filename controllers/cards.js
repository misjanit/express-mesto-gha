const Card = require('../models/card');
const VALIDATION_ERROR = 400;
const NOTFOUND_ERROR = 404; // пользователь не найден
const ERROR = 500; // ошибка по умолчанию

// Получаем объект из всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      return res.status(200).send({ cards })
    })
    .catch((err) => {
      if (err.name === 'Error') {
        return res.status(ERROR).send({ message: 'Произошла ошибка' })
      }
    })
}


// Создаем карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      return res.satus(200).send({ card })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные' })
      }
      if (err.name === 'Error') {
        return res.status(ERROR).send({ message: 'Произошла ошибка' })
      }
    })
}

module.exports.deleteCard = (req, res) => {
  const id = req.params;

  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        return res.status(NOTFOUND_ERROR).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные' })
      }
      if (err.name === 'Error') {
        return res.status(ERROR).send({ message: 'Произошла ошибка' })
      }
    })
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate( req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true } )
  .then((card) => {
    if (!card) {
      return res.status(NOTFOUND_ERROR).send({ message: 'Карточка не найдена' });
    }
    return res.status(200).send({ card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные' })
    }
    if (err.name === 'Error') {
      return res.status(ERROR).send({ message: 'Произошла ошибка' })
    }
  })
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate( req.params.cardId, { $pull: { likes: req.user._id } }, { new: true } )
  .then((card) => {
    if (!card) {
      return res.status(NOTFOUND_ERROR).send({ message: 'Карточка не найдена' });
    }
    return res.status(200).send({ card });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(VALIDATION_ERROR).send({ message: 'Переданы некорректные данные' })
    }
    if (err.name === 'Error') {
      return res.status(ERROR).send({ message: 'Произошла ошибка' })
    }
  })
}

