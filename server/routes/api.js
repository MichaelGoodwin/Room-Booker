'use strict';
const express         = require('express');
const router          = express.Router();
const passport        = require('passport');
const VERSION         = '0.0.1';

router.get('/loggedin', (req, res) => {
  res.send(req.isAuthenticated() ? req.user : false);
});

router.post('/register', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json({
      success: false,
      message: 'You are already logged in'
    });
  }
  
  passport.authenticate('local-signup', (err, response) => {
    if (err) {
      return next(err);
    }

    if (!response.success) {
      return res.json(response);
    }
    
    req.login(response.data, (ignored) => res.json(response));
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json({
      success: false,
      message: 'You are already logged in'
    });
  }
  
  passport.authenticate('local-login', (err, response) => {
    if (err) {
      return next(err);
    }

    // username and/or password missing
    if (response === false) {
      return res.send(false);
    }

    if (!response.success) {
      response.message = 'Invalid username or password';
      return res.json(response);
    }

    const user = response.data;
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({
        success: true,
        // Only return specific user info
        data: {
          _id: user._id,
          email: user.email,
          username: user.usernameCased
        }
      });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logOut();
  res.json({success: true});
});

// All API requests below this point should require authentication.
router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.send({
      success: false,
      redirectTo: '/login'
    });
  }
});

router.get('/version', (req, res) => {
  res.send(VERSION);
});

// Prevent API requests from loading the html page again causing recursive angular loading
router.use('*', (req, res) => {
  res.send({
    success: false,
    message: 'Unknown api request'
  });
});

module.exports = router;
