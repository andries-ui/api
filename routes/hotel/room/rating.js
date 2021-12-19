const express = require('express')
const RoomRating = require("../../../module/hotel/room/rating");
const route = express.Router();
const verify = require('../../../validation/sherable/verifyToken')


route.get("/", verify,async (req, res) => {
  RoomRating.find({}, async (err, results) => {
    res.send(results);
  });
});

route.get("/:id",verify, async (req, res) => {
  RoomRating.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id",verify, async (req, res) => {
  RoomRating.findById(req.params.id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
    });
});

route.delete("/",verify, async (req, res) => {
  RoomRating.deleteMany().exec((err) => {
    res.send("Removed Successfully");
  });
});

route.patch("/:id",verify, async (req, res) => {
  const updateRoomRate = new RoomRating({
    roomId: req.body.roomId,
    ratedStar: req.body.ratedStar,
    comment: req.body.comment,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  await RoomRating.updateOne(req.params.id, updateRoomRate, (err, results) => {
    if (!err) {
      return res.send("updated Successfully");
    }
    res.send(err);
  });
});

route.post("/",verify, async (req, res) => {
  try {
    const newRoomRate = new RoomRating({
      roomId: req.body.roomId,
      ratedStar: req.body.ratedStar,
      comment: req.body.comment,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await RoomRating.create(newRoomRate)
      .then(() => {
        res.send("room is rated");
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