exports.up = function (knex) {
  return knex.schema.createTable('ehr_records', (table) => {
    table.increments('id').primary();
    table.integer('appointment_id').unsigned().notNullable().unique()
      .references('id').inTable('appointments').onDelete('CASCADE');
    table.string('external_ehr_id', 100);
    table.json('structured_data').notNullable();
    table.string('sync_status', 30).defaultTo('synced');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('ehr_records');
};
