const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../config/Auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  try {
    if (!authHeader) {
      throw new AppError("JWT não informado");
    };

    const [, token] = authHeader.split(" ");

    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    if (!user_id) {
      throw new AppError("JWT inválido");
    };

    request.user = {
      id: Number(user_id)
    };

    next();
  } catch (err) {
    next(err);
  };

};

module.exports = ensureAuthenticated;