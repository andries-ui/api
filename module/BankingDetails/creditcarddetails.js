const mongoose = require("mongoose");

const CreditCardShema = mongoose.Schema({
 
  cardNumber: {
    type: String,
    required: true
  },
   holdersNames: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
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

const CreditCard = mongoose.model("creditcards", CreditCardShema);

module.exports =  CreditCard;
