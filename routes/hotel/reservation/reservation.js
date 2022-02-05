const express = require('express');
const RoomReservation = require('../../../module/hotel/reservation/resevation');
const route = express.Router();
const verify = require('../../../validation/sherable/verifyToken');
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

// Getting all
// --------------------------------------------------
route.get('/', async (req, res) => {
  try {
    RoomReservation.find({}, (err, results) => {
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

route.get('/reservation/:id', async (req, res) => {
  try {
    RoomReservation.find({guestId: req.params.id}, (err, results) => {
      if (err) {
        res.status(400).send({
          status: 'Failed',
          message: 'An error has been encountered',
          details: err + '.=>'
        })
      }

      res.send(results);
    });
  } catch (err) {
    res.send({
      status: 'Failed',
      message: 'Server connection has failed. Please try again in a moment',
      details: err + '.=='
    })
  }
});

// Getting one
// --------------------------------------------------
route.get('/:id', getRoomReservations, async (req, res) => {
  try {
    res.send(res.client);
  } catch (err) {
    return res.send({
      status: 'Failed',
      message: 'An error has been encountered',
      details: err
    });
  }
});

// Updating one
// --------------------------------------------------
route.patch('/:id', getRoomReservations, async (req, res) => {


  if (req.body.roomId != null) {
    res.client.roomId = req.body.roomId;
  }

  if (req.body.checkinDate != null) {
    res.client.checkinDate = req.body.checkinDate;
  }

  if (req.body.checkoutDate != null) {
    res.client.checkoutDate = req.body.checkoutDate;
  }

  if (req.body.adults != null) {
    res.client.adults = req.body.adults;
  }

  if (req.body.children != null) {
    res.client.children = req.body.children;
  }

  if (req.body.active != null) {
    res.client.active = req.body.active;
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
route.delete('/:id', getRoomReservations, async (req, res) => {

  try {
    await res.client.remove();
    res.send({
      status: 'Success',
      message: 'Reservation has been deleted',
    })
  } catch (err) {
    res.status(500).send({
      status: 'Failed',
      message: 'Invalid request',
      details: err + '.'
    })
  }

});

route.post("/", async (req, res) => {
  try {
    const newRoomReservation = new RoomReservation({
      guestId: req.body.guestId,
      hotelId: req.body.hotelId,
      roomId: req.body.roomId,
      transportation: req.body.transportation,
      checkinDate: req.body.checkinDate,
      checkoutDate: req.body.checkoutDate,
      adults: req.body.adults,
      active: true,
      children: req.body.children,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await RoomReservation.create(newRoomReservation)
      .then((results) => {

        sendEmail(req.body, res);
        
      })
      .catch((err) => {
        res.send({
          status: 'Failed',
          message: 'Could not submit the rating to the server, please try again in a moment',
          details: err +'.'
        })
      });
  } catch (err) {
     
    res.send({
      status: 'Failed',
      message: 'Failed to connect to the server. Please try in a moment',
      details: err +'.'
    })
  }
});

//functions 
async function getRoomReservations(req, res, next) {
  let client;
  try {
    client = await RoomReservation.findById(req.params.id);
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

const sendEmail = ((results, res) => {

  const { email,message, title, checkinDate,checkoutDate ,adults,children,transportation} = results;


  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: `${title}`,
    html: `<p> ${message}</p>
            
            <h5>Thank you for choosing us and we are hoping for a long and healthy journey through out.</h5>
            <h5>Reguards: SunStar development team:</h5>`
  };


  transporter.sendMail(mailOptions)
    .then(() => {
      res.send({
        status: 'Success',
        message: "Email is successfully sent."
      });
    })
    .catch((err) => {
      res.status(404).send({
        status: 'Failed',
        message: err.message
      });


    });
});



module.exports = route;

