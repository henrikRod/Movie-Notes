const AppError = require("../utils/AppError");
const authConfig = require("../config/Auth");
const knex = require("../database/knex");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(request, response, next) {
    const { password, email } = request.body;

    try {
      const user = await knex("users").where({ email }).first();

      if (!user) {
        throw new AppError("Email e/ou senha incorretos", 401);
      };

      const correctPassword = await compare(password, user.password);

      if (!correctPassword) {
        throw new AppError("Email e/ou senha incorretos", 401);
      };

      const { secret, expiresIn } = authConfig.jwt;
      const token = sign({}, secret, {
        subject: String(user.id),
        expiresIn
      });

      return response.json({ user, token });
    } catch (err) {
      next(err);
    };

  };
};

module.exports = SessionsController;