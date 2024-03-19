exports.up = function (knex, Promise) {
  return knex.schema.createTable("movie_notes", function (table) {
    table.increments("id");
    table.string("title");
    table.string("description");
    table.integer("rating");
    table.integer("user_id").references("id").inTable("users");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("movie_notes");
};
