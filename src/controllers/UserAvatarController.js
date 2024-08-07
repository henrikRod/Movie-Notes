const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update(request, response, next) {
    try {
      const id = request.user.id;
      const avatarFileName = request.file.filename;

      const diskStorage = new DiskStorage();

      const user = await knex("users").where({ id }).first();

      if (!user) {
        throw new AppError("Usuário não encontrado");
      };

      if (user.avatar) {
        await diskStorage.deleteFile(user.avatar);
      };

      const fileName = await diskStorage.saveFile(avatarFileName);
      user.avatar = fileName;

      await knex("users").update(user).where({ id });

      return response.json({ user });
    } catch (err) {
      next(err);
    }
  };

  async show(request, response, next) {
    try {
      const id = request.user.id;

      const avatarFileName = await knex("users").select("avatar").where({ id }).first();

      if (!avatarFileName) {
        throw new AppError("Foto de perfil inexistente");
      };

      return response.json(avatarFileName);
    } catch (err) {
      next(err);
    };
  }
};

module.exports = UserAvatarController;