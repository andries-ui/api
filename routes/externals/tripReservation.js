const express = require('express');
const Reservation = require('../../module/externals/tripReservations');
const schema = require('../../module/user/user')
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');


route.get("/", verify,async (req, res) => {
   Reservation.find({}, async (err, results) => {
    res.send(results);
  });
});

route.get("/:id", verify,async (req, res) => {
  Reservation.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id",verify, async (req, res) => {
  Reservation.findById(req.params.id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
    });
});


route.patch("/:id",verify,async (req, res) => {
  const updateReservation = new Reservation({
    
    driverId: req.body.driverId,
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

  Reservation.updateOne(
   req.params.id,
   updateReservation,
   (err, results) => {
     if (!err) {
       return res.send("updated Successfully");
     }
     res.send(err);
   }
 );
});

route.post("/",verify, async (req, res) => {
  try {
    const newReservation = new Reservation({
      
      driverId: req.body.driverId,
      userId: req.user._id,
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

    await Reservation.create(newReservation)
      .then(() => {
        res.send("Reserved");
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