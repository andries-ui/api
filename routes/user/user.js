const express = require('express');
const User = require('../../module/user/user');
const Verification = require('../../module/user/verification')
const {
  userValidation,
  userLogin
} = require('../../validation/externals/user');
const route = express.Router();
const bcrypt = require('bcryptjs');
const verify = require('../../validation/sherable/verifyToken');
const multer = require('multer');
const Joi = require('@hapi/joi');
const nodemailer = require('nodemailer');

require("dotenv").config();

//nodemailer transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.PASSWORD
  }
})

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Ready');
  }

})

//----------------------------------------------------


//multer storage config

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/user/');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
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
//-------------------------------------------------



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
  try {
    res.send(res.client);
  } catch (err) {
    return res.send({
      status: 'Failed',
      message: 'Account already exist.',
      details: err
    });
  }
});

route.post('/verify/:id', async (req, res) => {

  const {
    id
  } = req.params;

  Verification.find({
      id
    })
    .then((results) => {

      if (results.length < 0) {

        const {
          expiresAt
        } = results[0];

        if (expiresAt < Date.now()) {
          Verification.deleteOne(id)
            .then(() => {
              User.deleteOne({
                  _id: id
                })
                .then(() => {
                  return res.send({
                    status: 'Failed',
                    message: 'Link has expired, Please signup again.',
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res.send({
                    status: 'Failed',
                    message: 'An error occured while clearing expired user verification',
                  });
                })
            })
            .catch((err) => {
              console.log(err);
              return res.send({
                status: 'Failed',
                message: 'An error occured while clearing expired user verification',
                });
            })
        }

      } else {

        if(results[0].pin == req.body.pin){
    
        if (results) {
          User.updateOne({
              _id: id
            }, {
              verified: true
            })
            .then(() => {
              Verification.deleteOne({id})
                .then(() => {
                  return res.send({
                    status: 'Success',
                    message: 'Email is successfully registered'
                     });
                })
                .catch((err) => {
                  return res.send({
                    status: 'Failed',
                    message: 'An error occured while clearing expired user verification',
                    err: err + '.'
                     });
            });
          })
            .catch((err) => {
              return res.send({
                status: 'Failed',
                message: 'Error occured while updating user record verified',
                  });
            })
        } else {
          return res.send({
            status: 'Failed',
            message: 'Invalid varification details. Please refere to your inbox.',
               });
        }
      }else{
        return res.send({
          status: 'Failed',
          message: `Invalid pin. Please verify the pin from the email you recieved. ${results[0].pin + ' === ' + req.body.pin + " == " + id}`,
             });
      }

      }


    })
    .catch((err) => {
      return res.send({
        status: 'Failed',
        message: 'Account already exist.',
        details: err
      });
    })
})


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
      verified: false,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    });

    await User.create(user)
      .then((results) => {


        sendVerificationEmail(results, res)

      })
      .catch((err) => {
        res.status(400).send({
          status: 'Failed',
          message: 'Process unsuccessful',
          details: err + '.'
        });
      })

  } catch (err) {
    res.status(400).send({
      status: 'Failed',
      message: 'Faild to communicate with the server',
      details: err + '.'
    })
  }

})


// Updating one
// --------------------------------------------------
route.patch('/:id', upload.single('image'), getUser, async (req, res) => {

  if (req.file.filename != null) {
    res.client.url = {
      data: req.file.filename,
      contentType: 'image/png'
    }
  }

  if (req.body.names != null) {
    res.client.names = req.body.names;
  }

  if (req.body.username != null) {
    res.client.username = req.body.username;
  }

  if (req.body.password != null) {
    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    res.client.password = hashPassword;
  }

  if (req.body.contact != null) {
    res.client.contact = req.body.contact;
  }

  if (req.body.email != null) {
    res.client.email = req.body.email;
  }

  res.client.updatedAt = new Date();

  try {
    const updateUser = await res.client.save();
    res.send({
      status: 'Success',
      message: 'Updated is successful.',
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
    await res.client.remove();
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

//functions 
async function getUser(req, res, next) {
  let client;
  try {
    client = await User.findById(req.params.id);
    if (client == null) {
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
    });
  }

  res.client = client;

  next();

}

const sendVerificationEmail = (({
_id,
email
}, res) => {


let pin = Math.floor((Math.random() * 99000) + 10000);

const mailOptions = {
  from: process.env.AUTH_EMAIL,
  to: email,
  subject: 'Sunstar Email verification',
  html: `<p>Verify your e-mail address in order to complete your registration</p> 
          <p>This pin expires in <b>6 hours and if it does your account will be forfaited</b></p>
          <p> <h3><b>${pin}</b></h3> is your OTP to procceed.</p>
          
          <h5>Reguards: SunStar development team:</h5>`
};

await Verification.remove({
  userId: _id
});

const newVerification = new Verification({
  userId: _id,
  pin: pin,
  createdAt: Date.now(),
  expiresAt: Date.now() + 216000000
})

newVerification.save().then(() => {
  transporter.sendMail(mailOptions)
    .then(() => {
      res.status(201).send({
        status: 'Pending',
        message: "Email is successfully sent.",
        key:_id
      });
    })
    .catch((err) => {
      res.status(400).send({
        status: 'Failed',
        message: err
      });
    })
}).catch((err) => {
  res.status(201).send({
    status: 'Failed',
    message: "Couldn't save verification record"
  });
})
})


//--------------------------------------------------------
module.exports = route;