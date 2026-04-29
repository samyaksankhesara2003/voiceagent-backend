exports.up = function (knex) {
  return knex.schema.createTable('appointments', (table) => {
    table.increments('id').primary();
    table.integer('patient_id').unsigned().notNullable()
      .references('id').inTable('patients').onDelete('CASCADE');
    table.integer('doctor_id').unsigned().notNullable()
      .references('id').inTable('doctors').onDelete('CASCADE');
    table.date('date').notNullable();
    table.string('start_time', 5).notNullable();
    table.string('end_time', 5).notNullable();
    table.string('status', 30).defaultTo('confirmed');
    table.string('vapi_call_id', 100);
    table.timestamps(true, true);

    table.index(['doctor_id', 'date']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('appointments');
};
