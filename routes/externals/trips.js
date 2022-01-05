const express = require('express');
const Trip = require('../../module/externals/trips');
const schema = require('../../module/user/user')
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');



// Getting all
// --------------------------------------------------
route.get('/', async (req, res) => {
  try {
    Trip.find({}, (err, results) => {
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
route.get('/:id', getTrips, async (req, res) => {
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
route.patch('/:id', getTrips, async (req, res) => {


  if (req.body.driverId != null) {
    res.client.driverId = req.body.driverId;
  }

  if (req.body.vehicleId != null) {
    res.client.vehicleId = req.body.vehicleId;
  }

  if (req.body.pickupDate != null) {
    res.client.pickupDate = req.body.pickupDate;
  }

  if (req.body.pickupAddress != null) {
    res.client.pickupAddress = req.body.pickupAddress;
  }

  if (req.body.city != null) {
    res.client.city = req.body.city;
  }

  if (req.body.status != null) {
    res.client.status = req.body.status;
  }
  
  if (req.body.country != null) {
    res.client.country = req.body.country;
  }

  if (req.body.latitude != null) {
    res.client.latitude = req.body.latitude;
  }

  if (req.body.longitude != null) {
    res.client.longitude = req.body.longitude;
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


route.delete('/:id', getTrips, async (req, res) => {

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
    const newTrip = new Trip({
      driverId: req.body.driverId,
      userId: req.body.userId,
      vehicleId: req.body.vehicleId,
      pickupDate: req.body.pickupDate,
      pickupAddress: req.body.pickupAddress,
      city: req.body.city,
      status: req.body.status,
      country: req.body.country,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await Trip.create(newTrip)
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
async function getTrips(req, res, next) {
  let client;
  try {
    client = await Trip.findById(req.params.id);
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