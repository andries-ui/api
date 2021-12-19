const express = require('express')
const route = express.Router();
const Payment = require('../../../module/hotel/reservation/payment')
const verify = require('../../../validation/sherable/verifyToken')

route.get("/", async (req, res) => {
  Payment.find({}, (err, results) => {
    res.send(results);
  });
});

route.get("/:id", verify, async (req, res) => {
  Payment.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id", verify, async (req, res) => {
  Payment.findById(req.params.id)
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
  Payment.deleteMany().exec((err) => {
    res.send("Removed Successfully");
  });
});

route.patch("/:id", verify, async (req, res) => {
  const updatePayment = new Payment({
    guestId: req.body.guestId,
    reservationId: req.body.reservationId,
    amount: req.body.amount,
    paymentMethod: req.body.paymentMethod,
    status: req.body.status,
    createdAt: new Date(),
  });

  Payment.updateOne(req.params.id, updatePayment, (err, results) => {
    if (!err) {
      return res.send("updated Successfully");
    }
    res.send(err);
  });
});

route.post("/", verify, async (req, res) => {
  try {
    const newPayment = new Payment({
      guestId: req.user._id,
      reservationId: req.body.reservationId,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status,
      createdAt: new Date(),
    });

    await Payment.create(newPayment)
      .then(() => {
        res.send("Payment is successful");
      })
      .catch((err) => {
        res.send("err occuresd");
        console.log(err);
      });
  } catch (err) {
    res.send(err);
  }
})
module.exports = route;