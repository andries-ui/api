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


route.get("/", verify, async (req, res) => {
  Vehicle.find({}, async (err, results) => {
   res.send(results);
 });
});


route.get("/:id",verify, async (req, res) => {
  Vehicle.findById(req.params.id, (err, results) => {
   res.send(results);
 });
});

route.delete("/:id",verify, async (req, res) => {
  Vehicle.findById(req.params.id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
    });
});


route.patch("/:id",verify, async (req, res) => {
  const updateVehicle = new Vehicle({
    url: req.body.url,
    driverId: req.user._id,
    vehicleName: req.body.vehicleName,
    vehiclePlate: req.body.vehiclePlate,
    vehicleModel: req.body.vehicleModel,
    yearReleased: req.body.yearReleased,
    status: req.body.status,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  Vehicle.updateOne(req.params.id, updateVehicle, (err, results) => {
   
     return res.send("updated Successfully");

 });
});

route.post("/",verify, upload.single('car'), async (req, res) => {
  try {
      const newVehicle = new Vehicle({
        url: req.file.path,
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
        res.send("driver Saved");
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });

  } catch (err) {
    "err ==, " + err;
  }
});

module.exports = route;
