const express = require('express');
const Employee = require('../../../module/hotel/employee/employee');
const route = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Verification = require('../../../module/user/verification');

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
    console.log('MAiler is Ready');
  }

})

//----------------------------------------------------


//Authentication
route.post('/', async (req, res) => {

  try {
    const employee = new Employee({
      password: req.body.password,
      email: req.body.email,
    });

    // const 
    //   err
    //  = userLogin(req.body);

    // if (err) return res.status(400).send(err.error.details[0].message);

    // registered user
    const useremail = await Employee.findOne({
      email: req.body.email
    });

    //verify email or user name
    if (!useremail) {
      return res.send({
        status: 'Failed',
        message: 'You are not registered yet.'
      });
    }

 
    // registered user
    const type = await Employee.findOne({
      type: req.body.type
    });


    //verify email or user name
    if (type === "client") {
      return res.send({
        status: 'Failed',
        message: 'You are not allowd to access this portal.'
      });
    }

    if (useremail.verified == false) {
      return res.send({
        status: 'Failed',
        message: 'This account is not verified, Please refere to your inbox for the pin.',
      });
    } else {

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
        _id: Employee._id
      }, process.env.TOKEN_SECRET, {
        expiresIn: 86400
      });

      res.header('token', token).send({
        status: 'Success',
        message: 'You are signed in',
        token: token,
        key: useremail._id,
      });
    }

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
    const employee = new Employee({
      password: req.body.password,
      email: req.body.email,
    });

    const useremail = await Employee.findOne({
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

// Update/ Reset passeord
route.get('/', async (req, res) => {


  const userprofile = await Employee.findOne({
    email: req.body.email
  });

  if (!userprofile) {
    return res.send({
      status: 'Failed',
      message: 'Oops! this account does not exist. please signup to gain access.'
    });
  }

  sendVerificationEmail(userprofile, res);


});


route.get('/verify/:id', async (req, res) => {

  const {
    id
  } = req.params;

  Verification.findOne({
    userId:id
  })
    .then((results) => {

      if (results.length < 0) {

        const {
          expiresAt
        } = results[0];

        if (expiresAt < Date.now()) {

          Verification.deleteOne(id)
            .then(() => {
              return res.send({
                status: 'Success',
                message: 'Verification has been deleted bescause the required time colupsed ',
              });
            })
            .catch((err) => {
              console.log(err);
              return res.send({
                status: 'Failed',
                message: 'An error occured while clearing expired user verification',
              });
            });
        }

      } else {

        if (results[0].pin === req.body.pin) {

          if (results) {
            Verification.deleteOne({ userId:id })
              .then(() => {
                return res.send({
                  status: 'Success',
                  message: 'You may proceed to resset your password'
                });
              })
              .catch((err) => {
                return res.send({
                  status: 'Failed',
                  message: 'An error occured while clearing expired user verification',
                  err: err + '.'
                });
              });

          } else {
            return res.send({
              status: 'Failed',
              message: 'Invalid varification details. Please refere to your inbox.',
            });
          }
        } else {
          return res.send({
            status: 'Failed',
            message: 'Invalid pin. Please verify the pin from the email you recieved.',
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

//functions 
async function getEmployee(req, res, next) {
  var client;
  try {
    client = await User.findById(req.params.id);
    if (client == null) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Request is unsuccessful'
      });
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
    subject: 'Reset your password',
    html: `<p>We have recieve a request to reset the password for the SunStar app.</p> 
          <p> <h3><b>${pin}</b></h3> is your OTP to procceed and reset your password.</p>
          <p>This pin expires in <b>2 hours </b></p>
          
          <h5>Reguards: SunStar development team:</h5>`
  };


  const newVerification = new Verification({
    userId: _id,
    pin: pin,
    createdAt: Date.now(),
    expiresAt: Date.now() + 7200000
  })

  newVerification.save().then(() => {
    transporter.sendMail(mailOptions)
      .then(() => {
        return res.status(400).send({
          status: 'Pending',
          message: "Email is successfully sent.",
          key: _id
        });
      })
      .catch((err) => {
       return res.status(400).send({
          status: 'Failed',
          message: err
        });
      })
  }).catch((err) => {
    return res.status(201).send({
      status: 'Failed',
      message: "Couldn't save verification record"
    });
  })
})


module.exports = route;