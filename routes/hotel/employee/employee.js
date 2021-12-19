const bcrypt = require('bcryptjs');
const express = require('express');
const Employee = require('../../../module/hotel/employee/employee');
const route = express.Router();
const verify = require('../../../validation/sherable/verifyToken');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/hotel/employee/');
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
    Employee.find({}, (err, results) => {
        res.send(results);
    });
});

route.get("/:id", verify, async (req, res) => {
    Employee.findById(req.params.id, (err, results) => {
        res.send(results);
    });
});

route.delete("/:id", verify,async (req, res) => {
    Employee.findById(req.user._id)
        .deleteOne()
        .exec((err) => {
            res.send("Removed Successfully");
        });
});


route.patch("/:id", verify, async (req, res) => {


    const updateEmployee = new Employee({
        firstName: req.body.firstName,
            lastName: req.body.lastName,
            url: req.body.url,
            employeeType: req.body.employeeType,
            DOB: req.body.DOB,
            taxNumber: req.body.taxNumber,
            contact: req.body.contact,
            email: req.body.email,
            password: hashPassword,
            address: req.body.address,
            city: req.body.city,
            hotelId: req.user._id,
            updatedAt: null,
            deletedAt: null,
    });

    Employee.updateOne(req.params.id, updateEmployee, (err, results) => {
        if (!err) {
            return res.send("updated Successfully");
        }
        res.send(err);
    });
});

route.post("/", verify,  upload.single('employee') ,async (req, res) => {
    try {


        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);


        const newEmployee = new Employee({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            url: req.file.path,
            employeeType: req.body.employeeType,
            DOB: req.body.DOB,
            taxNumber: req.body.taxNumber,
            contact: req.body.contact,
            email: req.body.email,
            password: hashPassword,
            address: req.body.address,
            city: req.body.city,
            hotelId: req.user._id,
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
        });

        await Employee.create(newEmployee)
            .then(() => {
                res.send("user is employed");
            })
            .catch((err) => {
                res.send(err + " err occuresd");
                console.log(err);
            });
    } catch (err) {
        res.send(err +" -");
    }
});

module.exports = route;