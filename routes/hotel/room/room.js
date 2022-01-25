const express = require('express');
const Room = require('../../../module/hotel/room/room');
const route = express.Router();
const verify = require('../../../validation/sherable/verifyToken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/hotel/room/');
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
    Room.find({}, (err, results) => {
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

// route.get("/find", async (req, res)=>{
//   Room.find({name: req.body.name})
// })


// Getting one
// --------------------------------------------------
route.get('/:id', getRoom, async (req, res) => {
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
route.patch('/:id', getRoom, async (req, res) => {


  if (req.body.type != null) {
    res.client.type = req.body.type;
  }

  if (req.body.price != null) {
    res.client.price = req.body.price;
  }

  if (req.body.status != null) {
    res.client.status = req.body.status;
  }

  if (req.body.floor != null) {
    res.client.floor = req.body.floor;
  }
  
  if (req.body.roomNumber != null) {
    res.client.roomNumber = req.body.roomNumber;
  }

  res.client.updatedAt = new Date();

  try {
    const updateRoom = await res.client.save();
    res.send({
      status: 'Success',
      message: 'Updated is successful.',
      details: updateRoom
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


route.delete('/:id', getRoom, async (req, res) => {

  try {
    await res.client.remove();
    res.send({
      status: 'Success',
      message: 'Room has been deleted',
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
    const newRoom = new Room({
      type: req.body.type,
      price: req.body.price,
      status: true,
      floor: req.body.floor,
      roomNumber: req.body.roomNumber,
      hotelId: req.req.hotelId,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await Room.create(newRoom)
      .then(() => {
        res.status(201).send({status: "Success",
        message:"room Saved",
        key: newRoom._id});
      })
      .catch((err) => {
        res.status(400).send({status: "Success",
        message:err});
        console.log(err);
      });
  } catch (err) {
    resstatus(400).send({status: "Failed",
    message:err + "="});
  }
});

//functions 
async function getRoom(req, res, next) {
  let client;
  try {
    client = await Room.findById(req.params.id);
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