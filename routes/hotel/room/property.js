const express = require('express')
const Property = require("../../../module/hotel/room/property");
const route = express.Router();
const verify = require('../../../validation/sherable/verifyToken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/hotel/property/');
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



// Getting one
// --------------------------------------------------
route.get('/:id', getProperty, async (req, res) => {
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
route.patch('/:id', getProperty, async (req, res) => {


  if (req.body.bedtype != null) {
    res.client.bedtype = req.body.bedtype;
  }

  if (req.body.tv != null) {
    res.client.tv = req.body.tv;
  }

  if (req.body.wifi != null) {
    res.client.wifi = req.body.wifi;
  }

  if (req.body.parking != null) {
    res.client.parking = req.body.parking;
  }
  
  if (req.body.numberOfBed != null) {
    res.client.numberOfBed = req.body.numberOfBed;
  }

  res.client.updatedAt = new Date();

  try {
    const updateproperty = await res.client.save();
    res.send({
      status: 'Success',
      message: 'Updated is successful.',
      details: updateproperty
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


route.delete('/:id', getProperty, async (req, res) => {

  try {
    await res.client.remove();
    res.send({
      status: 'Success',
      message: 'property has been deleted',
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
    const newProperty = new Property({
      bedtype: req.body.bedtype,
      tv: req.body.tv,
      wifi: req.body.wifi,
      parking: req.body.parking,
      numberOfBed: req.body.numberOfBed,
      desc: req.body.desc,
      images: req.body.images,
      roomId: req.body.roomId,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    const isupdate = await Property.findOne({roomId:req.body.roomId});

    if(isupdate) return res.status(400).send("property property is already inserted. unles you want to update")

    await Property.create(newProperty)
      .then(() => {
        res.send({status: "Success",
        message:"Property details have been saved"});
      })
      .catch((err) => {
        res.send({status: "Failed",
        message:"Couldn't save property property details",
       key: newRoom._id});
        console.log(err + ".");
      });
  }catch (err) {
    console.log(err + ".");
  }
});


//functions 
async function getProperty(req, res, next) {
  let client;
  try {
    client = await Property.findOne({roomId:req.params.id});
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