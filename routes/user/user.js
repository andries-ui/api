const express = require('express');
const User = require('../../module/user/user');
const {
  userValidation,
  userLogin
} = require('../../validation/externals/user');
const route = express.Router();
const bcrypt = require('bcryptjs');
const verify = require('../../validation/sherable/verifyToken');
const multer = require('multer');
const Joi = require('@hapi/joi');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/user/');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname + new Date());
  }
});

const fileFilter = (req, file, callback) => {

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(new Error("File type is unsupported."), false);
  }

}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});




// Getting all
// --------------------------------------------------
route.get('/', async (req, res) => {
  try {
    User.find({}, (err, results) => {
      if (err) {
        res.status(400).send({
          status: 'Failed',
          message: 'An error has been encountered',
          details: err + '.'
        })
      }

      res.send(results);
    });
  } catch (err) {
    res.status(500).send({
      status: 'Failed',
      message: 'Server connection has failed. Please try again in a moment',
      details: err + '.'
    })
  }
});


// Getting one
// --------------------------------------------------
route.get('/:id', getUser, async (req, res) => {
  res.send(res.user);
});


// Creating one
// --------------------------------------------------
route.post('/', async (req, res) => {


  try {

    //  const err = userValidation(req.body);

    //  if(err ){ return res.status(400).send(err.error.details[0].message + " ===jh ")}


    // registered user
    const emailExist = await User.findOne({
      email: req.body.email
    });
    const usernameExist = await User.findOne({
      username: req.body.username
    });

    if (emailExist) {
      return res.send({
        status: 'Failed',
        message: 'Account already exist.'
      });
    }
    if (usernameExist) {
      return res.send({
        status: 'Failed',
        message: 'User name already exist'
      });
    }


    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      username: req.body.username,
      password: hashPassword,
      names: req.body.names,
      contact: req.body.contact,
      email: req.body.email,
      type: req.body.type,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    });

    await User.create(user)
      .then(() => {
        res.status(201).send({
          key: user._id,
          status: 'Successful',
          message: 'User is registered successfully.'
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: 'Failed',
          message: 'Process unsuccessful',
          details: err + '.'
        });
      })

  } catch (err) {
    res.send({
      status: 'Failed',
      message: 'Faild to communicate with the server',
      details: err + '.'
    })
  }

})



// Updating one
// --------------------------------------------------
route.patch('/:id', getUser, async (req, res) => {

  if (req.body.names != null) {
    res.user.names = req.body.names;
  }

  if (req.body.username != null) {
    res.user.username = req.body.username;
  }

  if (req.body.password != null) {
    res.user.password = req.body.password;
  }

  if (req.body.contact != null) {
    res.user.contact = req.body.contact;
  }

  if (req.body.email != null) {
    res.user.names = req.body.email;
  }

  res.user.updatedAt = req.body.updatedAt;

  try {
    const updateUser = await res.user.save();
    res.send({
      status: 'Success',
      message: 'User is updated',
      details: updateUser
    })

  } catch (err) {
    res.status(400).send({
      status: 'Failed',
      message: 'Request is unsuccessful',
      details: err + '.'
    })
  }

});

// Deleting one
// --------------------------------------------------

route.delete('/:id', getUser, async (req, res) => {

  try {
    await res.user.remove();
    res.send({
      status: 'Success',
      message: 'Account has been deletec',
    })
  } catch (err) {
    res.status(500).send({
      status: 'Failed',
      message: 'Invalid request',
      details: err + '.'
    })
  }

});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Request is unsuccessful'
      })
    }

  } catch (err) {
    return res.status(500).send({
      status: 'Failed',
      message: 'Invalid request',
      details: err + '.'
    })
  }

  res.user = user;

  next();

}
module.exports = route;