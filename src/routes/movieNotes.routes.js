const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const movieNotesController = new MovieNotesController();
const movieNotesRoutes = Router();

movieNotesRoutes.use(ensureAuthenticated);

movieNotesRoutes.get("/", movieNotesController.index);
movieNotesRoutes.post("/", movieNotesController.create);
movieNotesRoutes.get("/:id", movieNotesController.show);
movieNotesRoutes.delete("/:id", movieNotesController.delete);

module.exports = movieNotesRoutes;
