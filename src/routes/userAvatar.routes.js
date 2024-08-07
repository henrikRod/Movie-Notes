const { Router } = require("express");
const multer = require("multer");
const UserAvatarController = require("../controllers/UserAvatarController");
const { MULTER } = require("../config/uploads");

const userAvatarController = new UserAvatarController();
const userAvatarRoutes = Router();

const upload = multer(MULTER);

userAvatarRoutes.patch("/:id", upload.single("avatar"), userAvatarController.update);
userAvatarRoutes.get("/:id", userAvatarController.show);

module.exports = userAvatarRoutes;