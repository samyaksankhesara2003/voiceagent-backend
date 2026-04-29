exports.up = function (knex) {
  return knex.schema.createTable('calendar_events', (table) => {
    table.increments('id').primary();
    table.integer('appointment_id').unsigned().notNullable().unique()
      .references('id').inTable('appointments').onDelete('CASCADE');
    table.string('external_event_id', 100);
    table.string('title', 255).notNullable();
    table.datetime('start_datetime').notNullable();
    table.datetime('end_datetime').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('calendar_events');
};
