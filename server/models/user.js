/* eslint-disable no-useless-escape */
'use strict';
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const Schema   = mongoose.Schema;
const _WORK_FACTOR = 12;

const userSchema = new Schema({
  creationDate: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'You must provide an email address.'],
    match: [
      // Regex to ensure the value is an actual email. Pulled from emailregex.com 	
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
      'Not a valid email address.'
    ],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    // Length validation should be handled client-side since hashing will allow it to pass mongoose validators
    required: [true, 'Please enter a password.']
  },
  username: {
    type: String,
    minlength: [3, 'Your username must be at least 3 characters long.'],
    maxlength: [16, 'Your username can only be 16 characters long.'],
    required: [true, 'Please enter a username.'],
    unique: true,
    trim: true,
    lowercase: true
  },
  usernameCased: {
    type: String,
    trim: true
  }
});

// Encrypts the password and returns the hashed password as the second parameter to the callback
userSchema.methods.encryptPassword = (password, cb) => {
  // Generate Salt
  bcrypt.genSalt(_WORK_FACTOR, (err, salt) => {
    if (err) { 
      return cb(err); 
    }

    bcrypt.hash(password, salt, null, (err, hash) => {
      if (err) { 
        return cb(err); 
      }
      // Callback executed with hashed password text.
      cb(null, hash);
    });
  });
};

// Compare passed password with the stored password.
userSchema.methods.compareLocalPassword = function(password, cb) {
  bcrypt.compare(password, this.password, (err, res) => {
    if (err) { 
      return cb(err); 
    }

    cb(null, res);
  });
};

// Creates and exposes the model for users
module.exports = mongoose.model('User', userSchema);
