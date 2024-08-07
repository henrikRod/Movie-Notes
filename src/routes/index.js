const { Router } = require("express");

const userAvatarRoutes = require("./userAvatar.routes");
const movieNotesRoutes = require("./movieNotes.routes");
const movieTagsRoutes = require("./movieTags.routes");
const sessionsRoutes = require("./sessions.routes");
const usersRoutes = require("./users.routes");
const routes = Router();

routes.use("/movieNotes", movieNotesRoutes);
routes.use("/movieTags", movieTagsRoutes);
routes.use("/avatar", userAvatarRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/users", usersRoutes);

module.exports = routes;
