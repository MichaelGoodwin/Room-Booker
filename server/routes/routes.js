'use strict';
const path      = require('path');
const ApiRouter = require('./api');

const DIST_PATH = '../../Room-Booker/dist/Room-Booker';

module.exports = (app) => { 
  app.use('/api', ApiRouter);

  // Mongoose Schema Error Handling Middleware for easier front-end error display
  app.use((err, req, res, next) => {
    if (err.errors) {
      // Custom error object
      const e = {
        success: false,
        errors: []
      };

      for (const key in err.errors) {
        e.errors.push(err.errors[key].message);
      }

      res.json(e);
    }
  });

  // Catchall that redirects to index.html. This will then cause angular to load
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, DIST_PATH, 'index.html'));
  });
};
