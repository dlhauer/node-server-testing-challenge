const db = require('../data/db-config');

module.exports = {
  find,
  findBy,
  add
}

function find() {
  return db('users').select('username', 'password', 'department');
}

function findBy(filter) {
  return db('users')
          .where(filter);
}

function add(userData) {
  return db('users').insert(userData);
}