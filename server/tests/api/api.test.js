'use strict';
process.env.NODE_ENV = 'test';

// Testing dependencies
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const assert    = chai.assert;
chai.use(chaiHttp);

// Start the server & connect to the database
const app       = require('../../server.js');

// Database data preparations
const userPrep  = require('../lib/user.prep');
const dummyUser = require('../lib/user.data');

let server;
let agent;
before(async () => {
  server = await app;
  agent = chai.request.agent(server);
  await userPrep.createUser(server, dummyUser);   // Creates user for authentication
  await agent.post('/api/login').send(dummyUser); // Authenticates the agent connection via new user created above
});

after(async () => {
  await userPrep.deleteUser(dummyUser);
  agent.close();
});

const testUser = {
  email: 'test@example.com',
  username: 'Test User',
  password: 'test1234'
};

describe('/api/ tests', () => {
  describe('Registration tests (/api/register)', () => {
    it('register route refuses request if already authenticated', async () => {
      const res = await agent.post('/api/register').send({});
      assert.isFalse(res.body.success);
      assert.deepStrictEqual(res.body.message, 'You are already logged in');
    });
    
    it('Should return false due to empty request', async () => {
      const res = await chai.request(server)
        .post('/api/register')
        .send({});
        
      assert.isFalse(res.body);  
    });

    it('Should return false due to missing email', async () => {
      const res = await chai.request(server)
        .post('/api/register')
        .send({password: testUser.password});
      assert.isFalse(res.body);
    });

    it('Should return false due to missing password', async () => {
      const res = await chai.request(server)
        .post('/api/register')
        .send({email: testUser.email});
      assert.isFalse(res.body);
    });

    it('Should fail to create a new user due to missing username', async () => {
      const dummy = Object.assign({}, testUser);
      delete dummy.username;

      const res = await chai.request(server)
        .post('/api/register')
        .send(dummy);
      assert.isFalse(res.body.success);
      assert.equal(res.body.message, 'Missing username');
    });

    it('Should fail to create a new user due to invalid email format', async () => {
      const dummy = Object.assign({}, testUser);
      dummy.email = 'invalid';

      const res = await chai.request(server)
        .post('/api/register')
        .send(dummy);
      assert.isFalse(res.body.success);
      assert.includeMembers(res.body.errors, ['Not a valid email address.']);
    });

    it('Should fail to create a new user due to username being too short', async () => {
      const dummy = Object.assign({}, testUser);
      dummy.username = '12';

      const res = await chai.request(server)
        .post('/api/register')
        .send(dummy);
      assert.isFalse(res.body.success);
      assert.includeMembers(res.body.errors, ['Your username must be at least 3 characters long.']);
    });

    it('Should create a new user', async () => {
      const res = await chai.request(server)
        .post('/api/register')
        .send(testUser);
      assert.isTrue(res.body.success);
    });

    it('Should fail to create a new user due to duplicate email and username', async () => {
      const res = await chai.request(server)
        .post('/api/register')
        .send(testUser);
      assert.isFalse(res.body.success);
      assert.includeMembers(res.body.errors, ['username', 'email']);
    });

    after(() => {
      userPrep.deleteUser(testUser);
    });
  });

  describe('Account Login tests (/api/login)', () => {
    it('login route refuses request if already authenticated', async () => {
      const res = await agent.post('/api/login').send(dummyUser);
      assert.isFalse(res.body.success);
      assert.deepStrictEqual(res.body.message, 'You are already logged in');
    });
        
    it('Should return false due to empty request', async () => {
      const res = await chai.request(server)
        .post('/api/login')
        .send({});
      assert.isFalse(res.body);
    });

    it('Should return false due to missing email', async () => {
      const res = await chai.request(server)
        .post('/api/login')
        .send({password: testUser.password});
      assert.isFalse(res.body);
    });

    it('Should return false due to missing password', async () => {
      const res = await chai.request(server)
        .post('/api/login')
        .send({email: testUser.email});
      assert.isFalse(res.body);
    });

    it('Should fail to login due to `username` value not existing as an email/username in database', async () => {
      const dummy = Object.assign({}, testUser);
      dummy.username = 'dummy';

      const res = await chai.request(server)
        .post('/api/login')
        .send(dummy);
      assert.isFalse(res.body.success);
      assert.deepStrictEqual(res.body.message, 'Invalid username or password');
    });

    it('Should fail to login due to password mismatch', async () => {
      const dummy = Object.assign({}, testUser);
      dummy.password = 'wrong';

      const res = await chai.request(server)
        .post('/api/login')
        .send(dummy);
      assert.isFalse(res.body.success);
    });

    it('Should log the user in to the session', async () => {
      const res = await chai.request(server)
        .post('/api/login')
        .send(dummyUser);
      assert.isTrue(res.body.success);
      assert.equal(res.body.data.email, dummyUser.email);
      assert.equal(res.body.data.username, dummyUser.username);
    });
  });

  describe('General UnAuthorized tests', () => {
    it('Are logged out', async () => {
      const res = await chai.request(server).get('/api/loggedin');
      assert.isFalse(res.body);
    });

    it('Non-existent api route returns false & redirectTo /login', async () => {
      const res = await chai.request(server)
        .post('/api/somethingthatdoesnotexist')
        .send({});
      assert.isFalse(res.body.success);
      assert.deepStrictEqual(res.body.redirectTo, '/login');
    });

    it('Valid api route returns false & redirectTo /login', async () => {
      const res = await chai.request(server)
        .post('/api/somethingthatdoesnotexist')
        .send({});
      assert.isFalse(res.body.success);
      assert.deepStrictEqual(res.body.redirectTo, '/login');
    });
  });

  describe('General Authorized tests', () => {
    it('Are logged in', async () => {
      const res = await agent.get('/api/loggedin');
      assert.deepStrictEqual(res.body.email, dummyUser.email);
      assert.deepStrictEqual(res.body.username, dummyUser.username);
    });
  
    it('Non-existent api route returns false and messages Unknown api request', async () => {
      const res = await agent.post('/api/somethingthatdoesnotexist').send({});
      assert.deepStrictEqual(res.body.message, 'Unknown api request');
    });
  
    it('Version API route returns data (Existent api route)', async () => {
      const res = await agent.get('/api/version');
      assert.deepStrictEqual(res.text, '0.0.1');
    });
  
    it('register route refuses request if already authenticated', async () => {
      const res = await agent.post('/api/register').send(dummyUser);
      assert.isFalse(res.body.success);
      assert.deepStrictEqual(res.body.message, 'You are already logged in');
    });
  
    it('login route refuses request if already authenticated', async () => {
      const res = await agent.post('/api/login').send(dummyUser);
      assert.isFalse(res.body.success);
      assert.deepStrictEqual(res.body.message, 'You are already logged in');
    });

  
    // agent will be unauthenticated after this
    it('Logout from the application', async () => {
      const res = await agent.post('/api/logout').send({});
      assert.isTrue(res.body.success);
    });

    it('Should be logged out now', async () => {
      const loggedIn = await agent.get('/api/loggedin');
      assert.isFalse(loggedIn.body);
    });
  });
});
