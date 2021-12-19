const express = require('express');
const Location = require('../../module/shareble/location');
const {userValidation, userLogin}  = require('../../validation/externals/user');
const route = express.Router();
const bcrypt = require('bcryptjs');
const verify = require('../../validation/sherable/verifyToken');

route.get('/', verify, async (req,res)=>{
    Location.find({}, (err, results) => {
      res.send( results);
    });
});

route.get("/", verify,async (req, res) => {
    Location.findById(req.user._id, (err, results) => {
   res.send(results);
 });
});

route.patch("/",verify, async (req, res) => {
  const updateLocation = new Location({
    userid:  req.user._id,
    userType: req.body.userType,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    updatedAt: new Date(),
  });

  Location.findByIdAndUpdate(req.user._id, updateLocation, (err, results) => {
   if (!err) {
     return res.send(updateLocation);
   }
   res.send(err + "" );
 });
});

route.post('/',verify ,async(req,res)=>{   
 
   try{
     const {err} = userValidation(req.body);
       
     if(err) return res.status(400).send(err.details[0].message + "sdfghjk");

    const location = new Location({
        userid:  req.user._id,
        userType: req.body.userType,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    await Location.create(location)
    .then(()=>{
      res.send({key:location._id,
    user:req.user._id});
    })
    .catch((err)=>{
      res.send(err + " =")
      console.log(err);
    })
   }catch(err){
    res.send(err + "=");
    console.log();(err + "=");
   }
 
})

module.exports = route;