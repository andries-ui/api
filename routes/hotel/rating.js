const express = require("express");
const HotelRating = require("../../module/hotel/rating");
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken')



// Getting all
// --------------------------------------------------
route.get('/', async (req, res) => {
  try {
    HotelRating.find({}, (err, results) => {
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

route.get('/ratings/:id', async (req, res) => {
  try {
  
    HotelRating.find({hotelId: req.params.id}, (err, results) => {
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
route.get('/:id', getRating, async (req, res) => {
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
route.patch('/:id', getRating, async (req, res) => {


  if (req.body.ratedStar != null) {
    res.client.ratedStar = req.body.ratedStar;
  }

  if (req.body.comment != null) {
    res.client.comment = req.body.comment;
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


route.delete('/:id', getRating, async (req, res) => {

  try {
    await res.client.remove();
    res.send({
      status: 'Success',
      message: 'Hotel rating has been deleted',
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
    const newHotelRate = new HotelRating({
      hotelId: req.user._id,
      ratedStar: req.body.ratedStar,
      comment: req.body.comment,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await HotelRating.create(newHotelRate)
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
async function getRating(req, res, next) {
  let client;
  try {
    client = await HotelRating.findById(req.params.id);
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
