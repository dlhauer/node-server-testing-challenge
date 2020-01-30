
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl
      .string('username', 120)
      .notNullable()
      .unique();
    tbl.string('password', 120).notNullable();
    tbl.string('department').notNullable();
  })  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
