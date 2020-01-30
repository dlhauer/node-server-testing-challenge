const request = require('supertest');
const server = require('./server');
const db = require('../data/db-config')

describe('server', function() {

  beforeAll(async () => {
    await db('users').truncate();
  })

  it('runs the test', function() {
    expect(true).toBe(true);
  })

  describe('GET /', function() {
    it('returns 200 OK', () => {
      return request(server).get('/')
        .then(res => {
          expect(res.status).toBe(200);
        })
    })
    it('tells me it is working', () => {
      return(request(server)).get('/')
        .then(res => {
          expect(res.body.message).toEqual("It's working!");
        })
    })
  })

  describe('GET /api/users', () => {
    it('returns json', () => {
      return request(server).get('/api/users')
        .then(res => {
          expect(res.type).toMatch(/json/i);
        })
    })
    it('has a body', () => {
      return request(server).get('/api/users')
        .then(res => {
          expect(res.body).not.toBeFalsy();
        })
    })
  })
  
  describe('POST /api/register', () => {
    it('returns array of length 1', () => {
      return request(server)
        .post('/api/register')
        .send({
          username: 'leni',
          password: 'hauer',
          department: 'muggle'
        })
        .then(res => {
          expect(res.body).toHaveLength(1);
        })
    })
    
    it('does not allow duplicate usernames', () => {
      return request(server)
        .post('/api/register')
        .send({
          username: 'leni',
          password: 'hauer',
          department: 'muggle'
        })
        .then(res => {
          expect(res.status).toBe(500);
        })
    })
  })

  describe('POST /api/login', () => {

    it('returns a string with three parts separated by periods (a JWT, that is)', () => {
      return request(server)
        .post('/api/login')
        .send({
          username: 'leni',
          password: 'hauer'
        })
        .then(res => {
          expect(res.body.split('.')).toHaveLength(3);
        })
    })

    it('returns 401 when invalid credentials provided', () => {
      return request(server)
        .post('/api/login')
        .send({
          username: 'leni',
          password: 'howard' //This password is invalid, should return 401
        })
        .then(res => {
          expect(res.status).toBe(401);
        })
    })
  })

  describe('DELETE /api/users', () => {
    it('returns a full user object', () => {
      return request(server)
        .delete('/api/users/1')
        .then(res => {
          expect(Object.keys(res.body)).toEqual(['id', 'username', 'password', 'department'])
        })
    })

    it('returns 404 if user id is invalid', () => {
      return request(server)
        .delete('/api/users/1')
        .then(res => {
          expect(res.status).toBe(404);
          expect(res.body.message).toBe('No user with that id');
        })
    })
  })
})