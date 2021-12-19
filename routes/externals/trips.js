const express = require('express');
const Trips = require('../../module/externals/trips');
const schema = require('../../module/user/user')
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');

route.get("/", verify,async (req, res) => {
   Trips.find({}, async (err, results) => {
    res.send(results);
  });
});

route.get("/:id",verify, async (req, res) => {
   Trips.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id",verify, async (req, res) => {
   Trips.findById(req.params.id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
    });
});



route.post("/", verify, async (req, res) => {
  try {
    const newTrips = new Trips({
      
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

    await Trips.create(newTrips)
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