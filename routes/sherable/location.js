const express = require('express');
const Location = require('../../module/shareble/location');
const { userValidation, userLogin } = require('../../validation/externals/user');
const route = express.Router();

route.get('/', async (req, res) => {
  try {
    Account.find({}, (err, results) => {
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

route.get("/:id", async (req, res) => {
  try {
    Location.findOne({ _id: req.params.id }, (err, results) => {
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

route.post('/searchLocation/', async (req, res) => {
  try {
  
    Room.find({$or:[{city: req.body.value}, {city: req.body.value}]}, (err, results) => {
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

route.post('/', async (req, res) => {

  try {
    const { err } = userValidation(req.body);

    if (err) return res.status(400).send(err.details[0].message + "sdfghjk");

    const location = new Location({
      userid: req.user._id,
      userType: req.body.userType,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await Location.create(location)
      .then(() => {
        res.send({
          key: location._id,
          user: req.user._id
        });
      })
      .catch((err) => {
        res.send(err + " =")
        console.log(err);
      })
  } catch (err) {
    res.send(err + "=");
    console.log(); (err + "=");
  }

})

// Updating one
// --------------------------------------------------
route.patch('/:id', getAddress, async (req, res) => {



  if (req.body.address != null) {
    res.client.address = req.body.address;
  }

  if (req.body.city != null) {
    res.client.city = req.body.city;
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

//functions 
async function getAddress(req, res, next) {
  let client;
  try {
    client = await Location.findById(req.params.id);
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