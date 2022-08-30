/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // creates the lunch_week table
  return knex.schema.createTable('lunch_week', function (table) {
    table.increments('lunch_week_id').primary(); // auto-numbering primary key column
    table.date('week_of').notNullable();
    table.boolean('is_published').notNullable().defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // if we wanted to undo this migration, then we would drop the table
  return knex.schema.dropTable('lunch_week');
};
