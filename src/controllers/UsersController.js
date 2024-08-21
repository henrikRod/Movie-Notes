const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response, next) {
    const { name, email, password } = request.body;

    try {
      const userExists = await knex("users").where({ email }).first();

      if (userExists) {
        throw new AppError("Usuário já existe");
      };

      const hashedPassword = await hash(password, 8);
      await knex("users").insert({
        name: name,
        email: email,
        password: hashedPassword,
      });
      return response.json({ name, email, password });
    } catch (err) {
      next(err);
    };
  };

  async update(request, response, next) {
    try {
      const { oldPassword, newPassword, newEmail } = request.body;
      const id = request.user.id;

      const user = await knex("users").where({ id }).first();

      const correctPassword = await compare(oldPassword, user.password);

      if (oldPassword && newPassword) {
        if (!correctPassword) {
          throw new AppError("A senha está incorreta");
        }
        const newHashedPassword = await hash(newPassword, 8);
        await knex("users")
          .update({ password: newHashedPassword })
          .where({ id });
        return response.json("Senha trocada com sucesso");
      }

      if (oldPassword && newEmail) {
        if (!correctPassword) {
          throw new AppError("A senha está incorreta");
        }
        await knex("users").update({ email: newEmail }).where({ id });
        return response.json("Email trocado com sucesso");
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
