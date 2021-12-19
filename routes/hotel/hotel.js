const bcrypt = require('bcryptjs');
const express = require('express');
const Hotel = require('../../module/hotel/hotel');
const route = express.Router();
const verify = require('../../validation/sherable/verifyToken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/hotel/logo/');
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

route.get("/", verify, async (req, res) => {
  Hotel.find({}, (err, results) => {
    res.send(results);
  });
});

route.get("/:id", verify, async (req, res) => {
  Hotel.findById(req.params.id, (err, results) => {
    res.send(results);
  });
});

route.delete("/:id", verify, async (req, res) => {
  Hotel.findById(req.user._id)
    .deleteOne()
    .exec((err) => {
      res.send("Removed Successfully");
    });
});


route.patch("/:id", verify, async (req, res) => {


  const updateHotel = new Hotel({
    name: req.body.name,
    url: req.body.url,
    taxNumber: req.body.taxNumber,
    contact: req.body.contact,
    email: req.body.email,
    companyId: req.body.companyId,
    managerId: req.body.managerId,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
  });

  Hotel.updateOne(req.params.id, updateHotel, (err, results) => {
    if (!err) {
      return res.send("updated Successfully");
    }
    res.send(err);
  });
});

route.post("/", upload.single("image"), async (req, res) => {
  try {

    console.log(req.file);

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newHotel = new Hotel({
      name: req.body.name,
      url: req.file.path,
      taxNumber: req.body.taxNumber,
      contact: req.body.contact,
      email: req.body.email,
      password: hashPassword,
      companyId: req.body.companyId,
      managerId: req.body.managerId,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await Hotel.create(newHotel)
      .then(() => {
        res.send("hotel Saved");
      })
      .catch((err) => {
        res.send(err + " err occuresd");
        console.log(err);
      });
  } catch (err) {
    res.send(err);
  }
});

module.exports = route;