const express = require('express');
const User = require('../../module/user/user');
const {
  userLogin
} = require('../../validation/externals/user');
const route = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


route.post('/', async (req, res) => {

 
  const user = new User({
    password: req.body.password,
    email: req.body.email,
  });

  const 
    err
   = userLogin(req.body);

  if (err) return res.status(400).send(err.error.details[0].message);

  // registered user
  const useremail = await User.findOne({
    email: req.body.email
  });


  //verify email or user name
  if (!useremail ) return res.status(400).send('You are not registered with sunstar.');

  //verify password
  const validPassword = await bcrypt.compare(req.body.password ,useremail.password);

  if (!validPassword) return res.status(400).send( "Invalid email or password.");

  // create token
  const token = jwt.sign({
    _id: user._id
  }, process.env.TOKEN_SECRET);
  res.header('token', token).send(token);

})

module.exports = route;