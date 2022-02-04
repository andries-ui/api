const express = require('express');
const route = express.Router();
const HotelNotification = require("../../module/notification/hotelNotification");
const verify = require('../../validation/sherable/verifyToken')




// Getting all
// --------------------------------------------------
route.get('/', async (req, res) => {
  try {
    HotelNotification.find({}, (err, results) => {
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
route.get('/:id', getHotelNotifications, async (req, res) => {
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



// Deleting one
// --------------------------------------------------


route.delete('/:id', getHotelNotifications, async (req, res) => {

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

route.get('/notifications/:id', async (req, res) => {
  try {
    HotelNotification.find({userId: req.params.id}, (err, results) => {
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

route.post("/", async (req, res) => {
  try {
    const newHotelNotifications = new HotelNotifications({
      userId: req.body.userId,
      title: req.body.title,
      message: req.body.message,
      date: new Date(),
      createdAt: new Date(),
      deletedAt: null,
    });

    await HotelNotifications.create(newHotelNotifications)
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
async function getHotelNotifications(req, res, next) {
  let client;
  try {
    client = await HotelNotifications.findById(req.params.id);
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

