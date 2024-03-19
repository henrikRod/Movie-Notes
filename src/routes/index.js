const { Router } = require("express");

const usersRoutes = require("./users.routes");
const movieNotesRoutes = require("./movieNotes.routes");
const movieTagsRoutes = require("./movieTags.routes");
const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/movieNotes", movieNotesRoutes);
routes.use("/movieTags", movieTagsRoutes);

module.exports = routes;
