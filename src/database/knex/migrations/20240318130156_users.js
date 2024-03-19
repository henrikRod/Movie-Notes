exports.up = function (knex, Promise) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("name");
    table.string("email");
    table.string("password");
    table.string("avatar").nullable();
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("users");
};
