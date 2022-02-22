const mongoose = require('mongoose')


const imageSchema = mongoose.Schema({

  fileName: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String
  },
  userId: {
    type: String,
    required: true,
  }
});

const Image = mongoose.model("images", imageSchema);
module.exports = Image;