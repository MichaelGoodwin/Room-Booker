'use strict';
const express         = require('express');
const router          = express.Router();
const passport        = require('passport');

router.get('/loggedin', (req, res) => {
  res.send(req.isAuthenticated() ? req.user : false);
});

router.post('/register', (req, res, next) => {
  passport.authenticate('local-signup', (err, response) => {
    if (err) {
      console.log('Error registering user');
      console.log(err);
      return next(err);
    }

    return res.json(response);
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (err, response) => {
    if (err) {
      console.log('Error logging user in');
      console.log(err);
      return next(err);
    }

    if (!response.success) {
      return res.json(response);
    }

    const user = response.data;
    req.login(user, (err) => {
      if (err) {
        console.log('Error logging in');
        console.log(err);
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

// Prevent API requests from loading the html page again causing recursive angular loading
router.use('*', (req, res) => {
  res.send({
    success: false,
    message: 'Unknown api request'
  });
});

module.exports = router;
