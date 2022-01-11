const express = require('express');
const Account = require('../../module/user/account');
const schema = require('../../module/user/user');
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');


// Get one
// --------------------------------------------------
route.get("/:id", async (req, res) => {
 
  try {
    Account.findOne({_id:req.params.id}, (err, results) => {
      if (err) {
        res.status(400).send({
          status: 'Failed',
          message: 'An error has been encountered',
          details: err + '.'
        })
      }

      res.send(results);
    });
  } catch (err) {
    res.status(500).send({
      status: 'Failed',
      message: 'Server connection has failed. Please try again in a moment',
      details: err + '.'
    })
  }
  
});

// Post one
// --------------------------------------------------
route.post("/", async (req, res) => {
  try {

    const newAccount = new Account({
      blocked: false,
      active: true,
      warning: 0,
      userId: req.body.id,
      createdAt: new Date(),
      updatedAt: null,
    });

    await Account.create(newAccount)
      .then(() => {
        return res.status(201).send({
          status: 'Success',
          message: 'account has been created'
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
route.patch('/:id', getAccount, async (req, res) => {



  if (req.body.blocked != null) {
    res.client.blocked = req.body.blocked;
  }

  if (req.body.active != null) {
    res.client.active = req.body.active;
  }

  if (req.body.warning != null) {
    res.client.warning = req.body.warning;
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
async function getAccount(req, res, next) {
  let client;
  try {
    client = await Account.findById(req.params.id);
    if (client == null) {
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