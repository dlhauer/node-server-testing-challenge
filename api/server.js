const express = require('express');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secrets');
const restricted = require('./restricted-middleware');
const Users = require('../users/user-model');
const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({message: "It's working!"});
});

server.post('/api/register', (req, res) => {
  let user = req.body;
  const hash = bc.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(id => {
      res.status(201).json(id);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: 'Error saving new user'
      });
    });
});

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id
  Users.findById(id)
  .then(user => {
    if (user) {
      Users.remove(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error deleting user.'
      });
    });
    } else {
      res.status(404).json({message: 'No user with that id'})
    }
  })
});

server.get('/api/users', (req, res) => { //Got rid of restricted middleware
  // const department = req.user.department;
  // Users.findBy({ department })
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: 'Error retrieving users'
      });
    });
});

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bc.compareSync(password, user.password)) {
        const token = signToken(user);
        res.status(200).json(token);
      } else {
        res.status(401).json({
          message: 'Invalid credentials'
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: 'Error logging in.'
      });
    });
});

function signToken(user) {
  const payload = {
    user
  };
  const options = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = server;