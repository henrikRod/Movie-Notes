const multer = require("multer");
const { Router } = require("express");
const { MULTER } = require("../config/uploads");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const UserAvatarController = require("../controllers/UserAvatarController");

const userAvatarController = new UserAvatarController();
const userAvatarRoutes = Router();

const upload = multer(MULTER);

userAvatarRoutes.patch("/", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);
userAvatarRoutes.get("/", ensureAuthenticated, userAvatarController.show);

module.exports = userAvatarRoutes;