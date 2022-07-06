const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const { regexpLink } = require('../utils/constants');
const AuthError = require('../errors/auth-error');
const appErrors = require('../errors/app-errors');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => regexpLink.test(v),
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(appErrors.ERROR_INCORRECT_LOGIN_OR_PASS);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError(appErrors.ERROR_INCORRECT_LOGIN_OR_PASS);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
