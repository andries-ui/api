const express = require('express');
const User = require('../../module/user/user');
const {
  userLogin
} = require('../../validation/externals/user');
const route = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Authentication
route.post('/', async (req, res) => {

  try {
    const user = new User({
      password: req.body.password,
      email: req.body.email,
    });

    // const 
    //   err
    //  = userLogin(req.body);

    // if (err) return res.status(400).send(err.error.details[0].message);

    // registered user
    const useremail = await User.findOne({
      email: req.body.email
    });

    //verify email or user name
    if (!useremail) {
      return res.send({
        status: 'Failed',
        message: 'You are not registered yet.'
      });
    }

    // const 
    //   err
    //  = userLogin(req.body);

    // if (err) return res.status(400).send(err.error.details[0].message);

    // registered user
    const type = await User.findOne({
      type: req.body.type
    });

    //verify email or user name
    if (type === "client") {
      return res.send({
        status: 'Failed',
        message: 'You are not allowd to access this portal.'
      });
    }

    //verify password
    const validPassword = await bcrypt.compare(req.body.password, useremail.password);

    if (!validPassword) {
      return res.send({
        status: 'Failed',
        message: 'Invalid E-mail or password'
      });
    }

    
    // create token
    const token = jwt.sign({
      _id: user._id
    }, process.env.TOKEN_SECRET,{
      expiresIn: 86400
    });

    res.header('token', token).send({
      status: 'Success',
      message: 'You are signed in',
      token: token,
      key: useremail._id,
    });
  } catch (err) {
    res.send({
      status: 'Failed',
      message: 'You are not registered yet.',
      err: err + "."
    })
  }

})


//Re-authentication
route.post('/:id', async (req, res) => {

  try {
    const user = new User({
      password: req.body.password,
      email: req.body.email,
    });

    const useremail = await User.findOne({
      _id: req.params.id
    });

    //verify email or user name
    if (!useremail) {
      return res.send({
        status: 'Failed',
        message: 'Your Authentication has expired! Please sign in .'
      });
    }

    //verify password
    const validPassword = await bcrypt.compare(req.body.password, useremail.password);

    if (!validPassword) {
      return res.send({
        status: 'Failed',
        message: 'Invalid Password'
      });
    }


    res.send({
      status: 'Success',
      message: 'You are successfully reauthenticated',
    });
    
  } catch (err) {
    res.send({
      status: 'Failed',
      message: 'Invalid password',
      err: err + "."
    })
  }

})

module.exports = route;