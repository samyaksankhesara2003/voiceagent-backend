exports.up = function (knex) {
  return knex.schema.createTable('crm_leads', (table) => {
    table.increments('id').primary();
    table.integer('patient_id').unsigned().notNullable()
      .references('id').inTable('patients').onDelete('CASCADE');
    table.string('source', 50).defaultTo('voice_agent');
    table.text('interaction_summary').notNullable();
    table.string('status', 30).defaultTo('new');
    table.string('vapi_call_id', 100);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('crm_leads');
};
