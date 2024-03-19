const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNotesController {
  async create(request, response, next) {
    try {
      const { title, description, rating, tags } = request.body;
      const { user_id } = request.params;

      if (rating > 5 || rating < 0) {
        throw new AppError("A avaliação deve estar entre 0 e 5");
      }

      const [movie_notes] = await knex("movie_notes").insert({
        title,
        description,
        rating,
        user_id,
      });

      const tagsInsert = tags.map((tag) => {
        return {
          note_id: movie_notes,
          user_id,
          name: tag,
        };
      });

      await knex("movie_tags").insert(tagsInsert);

      return response.json({ title, description, rating, tags });
    } catch (error) {
      next(error);
    }
  }

  async show(request, response) {
    const { id } = request.params;
    const movieNotes = await knex("movie_notes").where({ id }).first();
    const movieTags = await knex("movie_tags").where({ note_id: id });
    return response.json({
      ...movieNotes,
      movieTags,
    });
  }

  async delete(request, response, next) {
    try {
      const { id } = request.params;
      const movieNote = await knex("movie_notes")
        .where({ id })
        .first()
        .delete();

      if (!movieNote) {
        throw new AppError("Nota inexistente");
      }

      return response.json("Nota deletada com sucesso");
    } catch (error) {
      next(error);
    }
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query;

    console.log(user_id, title, tags);
    let notes;

    if (tags) {
      const filteredTags = tags.split(",").filter((tag) => tag);
      notes = await knex("movie_tags")
        .select("movie_notes.id", "movie_notes.title", "movie_notes.user_id")
        .where("movie_notes.user_id", user_id)
        .whereLike("title", `%${title}%`)
        .whereIn("name", filteredTags)
        .orderBy("movie_notes.title")
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id");
    } else {
      notes = await knex("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);
      return {
        ...notes,
        tags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = MovieNotesController;
