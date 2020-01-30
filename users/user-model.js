const db = require('../data/db-config');

module.exports = {
  find,
  findBy,
  findById,
  add,
  remove
}

function find() {
  return db('users').select('username', 'password', 'department');
}

function findBy(filter) {
  return db('users')
          .where(filter);
}

function findById(id) {
  return db('users')
          .where({ id })
          .first();
}

function add(userData) {
  return db('users').insert(userData);
}

function remove(id) {
  return findById(id)
          .then(user => {
            return db('users')
                    .where({ id })
                    .del()
                    .then(() => {
                      return user;
                    })
          })
}