'use strict';

module.exports = {
  secret: 'devSecret',
  database: {
    url: 'mongodb://localhost:27017/roombooker',
    options: {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  morgan: {
    format: 'common',
    filename: '/logs/access.dev.log'
  }
};
