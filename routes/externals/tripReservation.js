const express = require('express');
const Reservation = require('../../module/externals/tripReservations');
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');


// Getting all
// --------------------------------------------------
route.get('/', async (req, res) => {
  try {
    Reservation.find({}, (err, results) => {
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
route.get('/:id', getReservations, async (req, res) => {
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
route.patch('/:id', getReservations, async (req, res) => {

  if (req.body.status != null) {
    res.client.status = req.body.status;
  }
  if (req.body.driverId != null) {
    res.client.driverId = req.body.driverId;
  }
  if (req.body.userId != null) {
    res.client.userId = req.body.userId;
  }
  if (req.body.pickupDate != null) {
    res.client.pickupDate = req.body.pickupDate;
  }
  if (req.body.pickupAddress != null) {
    res.client.pickupAddress = req.body.pickupAddress;
  }
  if (req.body.pickupDate != null) {
    res.client.pickupDate = req.body.pickupDate;
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


route.delete('/:id', getReservations, async (req, res) => {

  try {
    await res.client.remove();
    res.send({
      status: 'Success',
      message: 'Deleted',
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
    const newReservation = new Reservation({
      driverId: null,
      userId: req.body.userId,
      vehicleId: null,
      pickupDate: req.body.pickupDate,
      pickupAddress: req.body.pickupAddress,
      status: req.body.status,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await Reservation.create(newReservation)
      .then(() => {
        res.send({
          status: 'Success',
          message: 'Posted',
        })
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
async function getReservations(req, res, next) {
  let client;
  try {
    client = await Reservation.findById(req.params.id);
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



module.exports = route;