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
      const { oldPassword, newPassword, newEmail, userName } = request.body;
      const id = request.user.id;

      const user = await knex("users").where({ id }).first();

      if (!user) {
        throw new AppError("Usuário não encontrado");
      }

      if (newPassword) {
        if (!oldPassword) {
          throw new AppError("Senha antiga não fornecida.");
        }

        const correctPassword = await compare(oldPassword, user.password);
        if (!correctPassword) {
          throw new AppError("A senha está incorreta");
        }

        const newHashedPassword = await hash(newPassword, 8);
        await knex("users")
          .update({ password: newHashedPassword })
          .where({ id });
      }

      if (newEmail && newEmail !== user.email) {
        const checkEmail = await knex("users").where({ email: newEmail }).first();
        if (checkEmail && checkEmail.id !== user.id) {
          throw new AppError("O email já está em uso");
        }
        user.email = newEmail;
      }

      if (userName) {
        user.name = userName;
      }

      // Update the user's name and/or email
      await knex("users")
        .update({ name: user.name, email: user.email })
        .where({ id });

      return response.json("Dados atualizados com sucesso");
    } catch (error) {
      next(error);
    }
  }


}

module.exports = UsersController;
