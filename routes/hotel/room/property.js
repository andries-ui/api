const express = require('express')
const Property = require("../../../module/hotel/room/property");
const route = express.Router();
const verify = require('../../../validation/sherable/verifyToken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/hotel/property/');
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



route.get("/", verify,async (req, res) => {
  Property.find({}, async (err, results) => {
    res.send(results);
  });
});

route.get("/:id",verify, async (req, res) => {
  Property.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id",verify, async (req, res) => {
  Property.findById(req.params.id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
    });
});

route.delete("/",verify, async (req, res) => {
  Property.deleteMany().exec((err) => {
    res.send("Removed Successfully");
  });
});

route.patch("/:id",verify, async (req, res) => {

  const updateProperty = new Property({
    bedtype: req.body.bedtype,
    tv: req.body.tv,
    wifi: req.body.wifi,
    packing: req.body.packing,
    numberOfBed: req.body.numberOfBed,
    desc: req.body.desc,
    roomId: req.body.roomId,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  await Property.updateOne(req.params.id, updateRoomRate, (err, results) => {
    if (!err) {
      return res.send("updated Successfully");
    }
    res.send(err);
  });
});

route.post("/",verify, async (req, res) => {
  try {
    const newProperty = new Property({
      bedtype: req.body.bedtype,
      tv: req.body.tv,
      wifi: req.body.wifi,
      parking: req.body.parking,
      numberOfBed: req.body.numberOfBed,
      desc: req.body.desc,
      roomId: req.body.roomId,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    const isupdate = await Property.findOne({roomId:req.body.roomId});

    if(isupdate) return res.status(400).send("room property is already inserted. unles you want to update")

    await Property.create(newProperty)
      .then(() => {
        res.send("room property is updated");
      })
      .catch((err) => {
        res.send(err+ ".");
        console.log(err + ".");
      });
  }catch (err) {
    console.log(err + ".");
  }
});

module.exports = route;