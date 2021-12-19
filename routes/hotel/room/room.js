const express = require('express');
const Room = require('../../../module/hotel/room/room');
const route = express.Router();
const verify = require('../../../validation/sherable/verifyToken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/hotel/room/');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const fileFilter = (req, file, callback) => {

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(new Error("File type is unsupported."), false);
  }

}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});




route.get("/", async (req, res) => {
  Room.find({}, (err, results) => {
    res.send(results);
  });
});

route.get("/:id", async (req, res) => {
  Room.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id", async (req, res) => {
  Room.findById(req.params.id)
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

route.delete("/", async (req, res) => {
  Room.deleteMany().exec((err) => {
    res.send("Removed Successfully");
  });
});

route.patch("/:id", verify, async (req, res) => {

  const updateRoom = new Room({
    type: req.body.type,
    price: req.body.price,
    status: req.body.status,
    floor: req.body.floor,
    roomNumber: req.body.roomNumber,
    hotelId: req.user._id,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  Room.updateOne(req.params.id, updateRoom, (err, results) => {
    if (!err) {
      return res.send("updated Successfully");
    }
    res.send(err);
  });
});

route.post("/", verify, async (req, res) => {
  try {
    const newRoom = new Room({
      type: req.body.type,
      price: req.body.price,
      status: req.body.status,
      floor: req.body.floor,
      roomNumber: req.body.roomNumber,
      hotelId: req.user._id,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await Room.create(newRoom)
      .then(() => {
        res.send("room Saved");
      })
      .catch((err) => {
        res.send(err + '--');
        console.log(err);
      });
  } catch (err) {
    res.send(err +"-");
  }
});


module.exports = route;