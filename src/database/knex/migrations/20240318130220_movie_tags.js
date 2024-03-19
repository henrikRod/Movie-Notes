exports.up = function (knex, Promise) {
  return knex.schema.createTable("movie_tags", function (table) {
    table.increments("id");
    table.integer("note_id").references("id").inTable("movie_notes").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");
    table.string("name");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("movie_tags");
};
