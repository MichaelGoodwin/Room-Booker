'use strict';

const express         = require('express');          // Node library for easier routing
const bodyParser      = require('body-parser');      // Parses request body and exposes on req.body
const methodOverride  = require('method-override');  // Used to ensure HTTP verbs besides GET/POST work
const path            = require('path');
const fs              = require('fs');
const morgan          = require('morgan');           // Used to log to the server console.
const mongoose        = require('mongoose');         // ODM Library for MongoDB
const session         = require('express-session');  // Used to save the user session
const MongoStore      = require('connect-mongo')(session); // MongoDB session store for Connect and Express
const passport        = require('passport');         // Used to Authenticate user logins
const port            = process.env.PORT || 8000;     // Port to open the server on.
const app             = express();

// Pull config file based on environment settings
let configFilePath;
switch (process.env.NODE_ENV === null ? 'dev' : process.env.NODE_ENV.toLowerCase()) {
  case 'production': 
    configFilePath = './secure/config.js';
    break;
  case 'test':
  case 'testing':
    configFilePath = './config.testing.js';
    break;
  case 'dev':
  case 'development':
  default:
    configFilePath = './config.dev.js';
    app.use(morgan('dev'));
}

const config          = require(configFilePath);
console.log('Server is configured to run using the config file located at ' + configFilePath);

app.use(express.static(path.join(__dirname, '../Room-Booker/dist/Room-Booker')));  // Exposes the angular app content
app.use(bodyParser.urlencoded({'extended': 'true'}));                   // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                             // parse application/json
app.use(methodOverride());                                              // Adds support for HTTP verbs such as PUT/DELETE in places where the client doesn't support it.

// Logging setup
app.use(morgan(config.morgan.format, {
  stream: fs.createWriteStream(path.join(__dirname, config.morgan.filename), { flags: 'a'})
}));

app.use(session({ 
  resave: true,             // Save session even if unmodified
  saveUninitialized: false, // Do not save sessions until something is stored
  cookie: {
    maxAge: 3600000,        // 1 hour in Milliseconds
  },
  name: 'Room Booker',
  secret: config.secret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    touchAfter: 300         // Limit session re-saving to once every 5 minutes unless session data changes
  })
}));

// Configure passport.
require('./config/passport.js');
app.use(passport.initialize());
app.use(passport.session());      // Passport piggybacks off express sessions

// Initialize all express routes
require('./routes/routes.js')(app);

// Export app for integration tests as a promise
module.exports = new Promise((resolve, reject) => {
  // Connect to the database and then start the server
  mongoose.connect(config.database.url, config.database.options)
    .then(() => {
      console.log('Successfully connected to MongoDB');
      app.server = app.listen(port, () => {
        console.log(`Server is now listening on port: ${port}`);
        resolve(app);
      });
    })
    .catch((e) => {
      console.error(e);
      console.log('Error connecting to database, aborting attempt to start server');
      reject(e);
    });
});
