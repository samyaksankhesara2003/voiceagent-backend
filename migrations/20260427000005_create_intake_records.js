exports.up = function (knex) {
  return knex.schema.createTable('intake_records', (table) => {
    table.increments('id').primary();
    table.integer('appointment_id').unsigned().notNullable().unique()
      .references('id').inTable('appointments').onDelete('CASCADE');
    table.integer('patient_id').unsigned().notNullable()
      .references('id').inTable('patients').onDelete('CASCADE');
    table.string('reason_for_visit', 255).notNullable();
    table.text('symptoms');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('intake_records');
};
