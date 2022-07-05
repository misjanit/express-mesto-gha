const VALIDATION_ERROR = 400; // переданы некорректные данные
const NOTFOUND_ERROR = 404; // пользователь не найден
const SERVER_ERROR = 500; // ошибка по умолчанию
const regexpLink = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

module.exports = {
  VALIDATION_ERROR,
  NOTFOUND_ERROR,
  SERVER_ERROR,
  regexpLink,
};
