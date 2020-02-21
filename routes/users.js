const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

// Schemas
const User = require('../models/user-model');


// middleware to check whether user loged ib
function isLoged(req, res, next) {
  const user = req.user;
  if (user) {
    next()
  } else {
    res.redirect('/user/registration')
  }
}

// REGISTRATION

router.get('/new', (req, res, next) => {
  res.render('registration')
});

router.post('/new', async (req, res) => {
  const { email, username, password, subscribed, city } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({
      email,
      username,
      password: hashedPass,
      'subscribed': !!subscribed,
      city
    })
    newUser.save()
    res.render('login')
  } catch (e) {
    res.status(400).redirect('/users/new')
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/index'
}))

router.get('/logout', isLoged, (req, res) => {
  req.session.destroy();
  res.clearCookie('token');
  res.redirect('/');
})


module.exports = router;
