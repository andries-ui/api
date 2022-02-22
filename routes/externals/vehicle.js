const express = require("express");
const Vehicle = require("../../module/externals/vehicle");
const verify = require('../../validation/sherable/verifyToken');
const route = express();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/vehicle/');
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



// Getting all
// --------------------------------------------------
route.get('/', async (req, res) => {
  try {
    Vehicle.find({}, (err, results) => {
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
route.get('/:id', getVehicle, async (req, res) => {
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
route.patch('/:id', getVehicle, async (req, res) => {


  if (req.body.vehicleName != null) {
    res.client.vehicleName = req.body.vehicleName;
  }

  if (req.body.vehiclePlate != null) {
    res.client.vehiclePlate = req.body.vehiclePlate;
  }

  if (req.body.vehicleModel != null) {
    res.client.vehicleModel = req.body.vehicleModel;
  }

  if (req.body.yearReleased != null) {
    res.client.yearReleased = req.body.yearReleased;
  }

  if (req.body.status != null) {
    res.client.status = req.body.status;
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


route.delete('/:id', getVehicle, async (req, res) => {

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
    const newVehicle = new Vehicle({
        driverId: req.body.driverId,
        vehicleName: req.body.vehicleName,
        vehiclePlate: req.body.vehiclePlate,
        vehicleModel: req.body.vehicleModel,
        yearReleased: req.body.yearReleased,
        status: req.body.status,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
    });

    await Vehicle.create(newVehicle)
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
async function getVehicle(req, res, next) {
  let client;
  try {
    client = await Vehicle.findById(req.params.id);
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
