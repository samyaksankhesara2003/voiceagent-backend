exports.up = function (knex) {
  return knex.schema.createTable('availabilities', (table) => {
    table.increments('id').primary();
    table.integer('doctor_id').unsigned().notNullable()
      .references('id').inTable('doctors').onDelete('CASCADE');
    table.date('date').notNullable();
    table.string('start_time', 5).notNullable();
    table.string('end_time', 5).notNullable();
    table.boolean('is_booked').defaultTo(false);

    table.unique(['doctor_id', 'date', 'start_time']);
    table.index(['doctor_id', 'date', 'is_booked']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('availabilities');
};
