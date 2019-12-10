/* eslint-disable require-jsdoc */
'use strict';
const chai      = require('chai');
const chaiHttp  = require('chai-http');
chai.use(chaiHttp);
const Users     = require('../../models/user');

async function createUser(server, dummyUser) {
  await chai.request(server)
    .post('/api/register')
    .send(dummyUser);
}

async function deleteUser(dummyUser) {
  const user = Object.assign({}, dummyUser);
  delete user.password;
  await Users.deleteOne(user);
}

module.exports = { 
  createUser,
  deleteUser
};
