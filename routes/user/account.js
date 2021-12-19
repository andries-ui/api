const express = require('express');
const Account = require('../../module/user/account');
const schema = require('../../module/user/user');
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');



route.get("/", verify, async (req, res) => {
  Account.findById(req.user._id, (err, results) => {
    res.send(results);
  });
});

route.patch("/",verify, async (req, res) => {
  try{
  const updateAccount = new Account({
    blocked: req.body.blocked,
    active: req.body.active,
    warning: req.body.warning,
    updatedAt: new Date(),
  });

  Account.findByIdAndUpdate(req.user_id, updateAccount, (err, results) => {
   if (!err) {
     return res.send(results);
   }
   res.send(err + "" );
 });
} catch (err) {
  res.send(err +" .");
}
});

route.post("/",verify, async (req, res) => {
  try {

    const newAccount = new Account({
      blocked: req.body.blocked,
      active: req.body.active,
      warning: req.body.warning,
      userId: req.user._id,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await Account.create(newAccount)
      .then(() => {
        res.send(" Account created");
      })
      .catch((err) => {
        res.send(err);
        console.log(err);
      });
  } catch (err) {
    res.send(err +" .");
  }
});  
module.exports = route;