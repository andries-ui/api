const express = require("express");
const HotelRating = require("../../module/hotel/rating");
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken')

route.get("/",verify, async (req, res) => {
  HotelRating.find({}, async (err, results) => {
    res.send(results);
  });
});

route.get("/:id",verify, async (req, res) => {
  HotelRating.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id",verify, async (req, res) => {
  HotelRating.findById(req.params.id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
    });
});

route.delete("/",verify, async (req, res) => {
  HotelRating.deleteMany().exec((err) => {
    res.send("Removed Successfully");
  });
});

route.patch("/:id",verify, async (req, res) => {
  const updateHotelRate = new HotelRating({
    hotelId: req.body.hotelId,
    ratedStar: req.body.ratedStar,
    comment: req.body.comment,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  await HotelRating.updateOne(req.params.id, updateHotelRate, (err, results) => {
    if (!err) {
      return res.send("updated Successfully");
    }
    res.send(err);
  });
});

route.post("/",verify, async (req, res) => {
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
        res.send("hotel is rated");
      })
      .catch((err) => {
        res.send(err + "- ");
        console.log(err + "- ");
      });
  } catch (err) {
     
    res.send(err + "- ");
  }
});

module.exports = route;
