'use strict';

module.exports = {
  secret: 'testingSecret',
  database: {
    url: 'mongodb://localhost:27017/roombooker-testing',
    options: {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  morgan: {
    format: 'common',
    filename: '/logs/access.testing.log'
  }
};
