const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({

  hotelId: {
    type: String,
    require: true,
  },
  ratedStar: {
    type: String,
    require: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

const HotelRating = mongoose.model("hotelratings", ratingSchema);
module.exports = HotelRating;