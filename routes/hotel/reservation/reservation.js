const express = require('express');
const RoomReservation = require('../../../module/hotel/reservation/resevation');
const route = express.Router();
const verify = require('../../../validation/sherable/verifyToken')

route.get("/", async (req, res) => {
  RoomReservation.find({}, (err, results) => {
    res.send(results);
  });
});

route.get("/:id", verify, async (req, res) => {
  RoomReservation.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id", verify, async (req, res) => {
  RoomReservation.findById(req.params.id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
      //  if (!err) {
      //    console.log("Removed Successfully");
      //    res.send("Removed Successfully");
      //  } else {
      //    console.log("Error in removing the entry");

      //    res.send(err);
      //  }
    });
});

route.delete("/", verify, async (req, res) => {
  RoomReservation.deleteMany().exec((err) => {
    res.send("Removed Successfully");
  });
});

route.patch("/:id", verify, async (req, res) => {
  const updateRoomReservation = new RoomReservation({
    guestId: req.user._id,
    hotelId: req.body.hotelId,
    roomId: req.body.roomId,
    transportation: req.body.transportation,
    checkinDate: req.body.checkinDate,
    checkoutDate: req.body.checkoutDate,
    adults: req.body.adults,
    children: req.body.children,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  RoomReservation.updateOne(req.params.id, updateRoomReservation, (err, results) => {
    if (!err) {
      return res.send("updated Successfully");
    }
    res.send(err);
  });
});

route.post("/", verify, async (req, res) => {
  try {
    const newRoomReservation = new RoomReservation({
      guestId: req.user._id,
      hotelId: req.body.hotelId,
      roomId: req.body.roomId,
      transportation: req.body.transportation,
      checkinDate: req.body.checkinDate,
      checkoutDate: req.body.checkoutDate,
      adults: req.body.adults,
      children: req.body.children,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await RoomReservation.create(newRoomReservation)
      .then(() => {
        res.send("Room is reserved.");
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  } catch (err) {
    res.send(err);
  }
});
module.exports = route;

