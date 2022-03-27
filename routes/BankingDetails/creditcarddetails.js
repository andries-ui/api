const express = require('express');
const CreditCard = require('../../module/BankingDetails/creditcarddetails');
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');


// Get one
// --------------------------------------------------
route.get("/:id", getCreditCard, async (req, res) => {

  try {
    res.send(res.client);
  } catch (err) {
    return res.send({
      status: 'Failed',
      message: 'CreditCard not found.',
      details: err
    });
  }

});

// Post one
// --------------------------------------------------
route.post("/", async (req, res) => {
  try {

    const newCreditCard = new CreditCard({
      cardNumber: req.body.cardNumber,
      holdersNames: req.body.holdersNames,
      expiryDate: req.body.expiryDate,
      cvv: req.body.cvv,
      userId: req.body.userId,
      createdAt: new Date(),
      updatedAt: null,
    });

    await CreditCard.create(newCreditCard)
      .then(() => {
        return res.status(201).send({
          status: 'Success',
          message: 'CreditCard has been created'
        });
      })
      .catch((err) => {
        return res.status(400).send({
          status: 'Failed',
          message: err
        });
      });
  } catch (err) {
    return res.status(400).send({
      status: 'Failed',
      message: err
    });
  }
});

// Updating one
// --------------------------------------------------
route.patch('/:id', getCreditCard, async (req, res) => {


  if (req.body.holdersNames != null) {
    res.client.holdersNames = req.body.holdersNames;
  }

  if (req.body.expiryDate != null) {
    res.client.expiryDate = req.body.expiryDate;
  }

  if (req.body.cardNumber != null) {
    res.client.cardNumber = req.body.cardNumber;
  }

  if (req.body.cvv != null) {
    res.client.cvv = req.body.cvv;
  }


  res.client.updatedAt = new Date();

  try {
    const updateUser = await res.client.save();
    res.send({
      status: 'Success',
      message: 'Updated is successful.',
      details: updateUser
    })

  } catch (err) {
    res.status(400).send({
      status: 'Failed',
      message: 'Request is unsuccessful',
      details: err + '.'
    })
  }

});

//functions 
async function getCreditCard(req, res, next) {
  let client;
  try {
    client = await CreditCard.findById(req.params.id);
    if (client != null) {
      return res.status(404).send({
        status: 'Failed',
        message: 'Request is unsuccessful'
      })
    }

  } catch (err) {
    return res.status(500).send({
      status: 'Failed',
      message: 'Invalid request',
      details: err + '.'
    });
  }

  res.client = client;

  next();

}

module.exports = route;