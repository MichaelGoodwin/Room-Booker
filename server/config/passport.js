'use strict';
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/user.js');

// Used to serialize the user for the session on `req.passport.session`
passport.serializeUser((user, done) => {
  // Passes back just the user ID
  done(null, user._id);
});

// Used to deserialize the user object and attaches to `req.user`
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Signup method for email and password.
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, done) => {
  // Returned as second parameter if no error from mongoose/other libraries
  const results = {
    success: false,
    data: {}
  };

  if (!req.body.username) {
    results.message = 'Missing username';
    return done(null, results);
  }

  // lowercase the necessary values
  const lowerCasedEmail = email.toLowerCase();
  const lowerCasedUsername = req.body.username.toLowerCase();
  
  User.find({ $or: [{'username': lowerCasedUsername}, {'email': lowerCasedEmail}] }, (err, users) => {
    if (err) {
      return done(err);
    }

    // Check if there are any accounts that already exists with specified information.
    if (users.length > 0){
      // Account already exists with either the username/email. Loop over the array to check which is taken
      results.errors = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === lowerCasedUsername){
          results.errors.push('username');
        }

        if (users[i].email === lowerCasedEmail){
          results.errors.push('email');
        }
      }

      // Returning errors.
      return done(null, results);
    }

    // No user was found, lets create a new entry.    
    const newUser = new User({
      email: lowerCasedEmail,
      username: lowerCasedUsername,
      usernameCased: req.body.username
    });

    // encrypt the password so we don't store it in plain text
    newUser.encryptPassword(password, (err, newPassword) => {
      if (err) {
        results.message = 'Error encrypting password';
        return done(null, results);
      }

      // Attach hashed password to newUser object.
      newUser.password = newPassword;

      newUser.save((err) => {
        if (err){
          // Mongoose error
          return done(err);
        }

        // New user finally created
        results.success = true;
        results.data = newUser;
        return done(null, results);
      });
    });
  });
}));

// Local login.
passport.use('local-login', new LocalStrategy({}, (email, password, done) => {
  const results = {
    success: false
  };

  const lowerCasedEmail = email.toLowerCase();

  // Find a user whose email or username is the same as the request.
  User.findOne({ $or: [{'username': lowerCasedEmail}, {'email': lowerCasedEmail}] }, (err, user) => {
    if (err){
      // Mongoose error
      return done(err);
    }

    if (!user){
      return done(null, results);
    } 

    user.compareLocalPassword(password, (err, correct) => {
      if (err){
        return done(err);
      }

      if (!correct){
        return done(null, results);
      }

      results.success = true;
      results.data = user;
      return done(null, results);
    });
  });
}));
