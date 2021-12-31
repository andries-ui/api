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


const schema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().required(),
  names: Joi.string().min(3).required(),
  contact: Joi.string().length(10).required(),
  email: Joi.string().email().required(),
  type: Joi.string().required(),
});


route.get('/getall', async (req, res) => {
  User.find({}, (err, results) => {
    res.send(results);
  });
});

route.get("/",verify, async (req, res) => {
  User.findById(req.user._id, (err, results) => {
    res.send({
      status: 'Successful',
      message: 'User retrieved',
      res: res.send(results)
    });
  })
  .then((res)=>{
    res.send({
      status: 'Successful',
      message: 'User retrieved'
    })
    .catch((err)=>{
      res.send({
        status: 'Failed',
        message: err + '.'
      });
    });
  });
});

route.delete("/delete", verify, async (req, res) => {
  User.findById(req.user._id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
      //  if (!err) {
      //    console.log("Removed Successfully");
      //    res.send("Removed Successfully");
      //  } else {
      //    console.log("Error in removing the entry");

      //    res.send(err);
      //  }
    });
});



route.patch("/update", verify, async (req, res) => {
  const updateUser = new User({
    _id: req.user._id,
    names: req.body.names,
    url: req.body.url,
    contact: req.body.contact,
    type: req.body.type,
    updatedAt: new Date(),
  });

  try {
    User.findById(req.user._id).update(updateUser)
      .then((results) => {

        // if(err) return res.status(400).send('Could not update successfully')
        res.send(results)
      })
      .catch((err) => {
        res.send(err + ".")
      })

  } catch (err) {
    res.send(err + ".--")
  }

});

route.post('/signup', async (req, res) => {


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

    if (emailExist)
     {return res.send({
      status: 'Failed',
      message: 'Account already exist.'
    });}
    if (usernameExist)
    { return res.send({
      status: 'Failed',
      message: 'User name already exist'
    });}


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
        res.send({
          key: user._id,
          status: 'Successful',
          message: 'User is registered successfully.'
        });
      })
      .catch((err) => {
        res.send({
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

module.exports = route;