const mongoose = require("mongoose");

const userShema = mongoose.Schema({
 
  username: {
    type: String,
  },
   password: {
    type: String,
  },
  names: {
    type: String,
  },
   url: {
    type: String,
  },
  email: {
    type: String,
  },
  
   contact: {
    type: String,
  },
  type: {
    type: String,
  },
  createdAt: {
    type: String
  },
  updatedAt: {
    type: String
  },
  deletedAt: {
    type: String
  },
});

const User = mongoose.model("users", userShema);

module.exports =  User;
