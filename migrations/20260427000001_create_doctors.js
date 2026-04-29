exports.up = function (knex) {
  return knex.schema.createTable('doctors', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('specialty', 100).notNullable();
    table.text('bio');
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('doctors');
};
