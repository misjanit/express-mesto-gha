const jwt = require('jsonwebtoken');
const appErrors = require('../errors/app-errors');

const { NODE_ENV, JWT_SECRET } = process.env;
const AuthError = require('../errors/auth-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(appErrors.ERROR_AUTH_REQUIRED);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret');
  } catch (err) {
    throw new AuthError(appErrors.ERROR_AUTH_REQUIRED);
  }
  req.user = payload;
  next();
};
