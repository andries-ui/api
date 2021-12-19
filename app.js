const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser')

//importing routes
const userRoute = require('./routes/user/user');
const hotelRoute = require('./routes/hotel/hotel');
const tripReservationRoute = require("./routes/externals/tripReservation");
const tripsRoute = require("./routes/externals/trips");
const vehicleRoute = require('./routes/externals/vehicle')
const hotelRatingRoute = require('./routes/hotel/rating')
const paymentRoute = require('./routes/hotel/reservation/payment')
const roomReservationRoute = require('./routes/hotel/reservation/reservation')
const roomRatingRoute = require("./routes/hotel/room/rating");
const roomRoute = require("./routes/hotel/room/room");
const accountRoute = require("./routes/user/account");
const loginRoute = require("./routes/user/login")
const hotelloginRoute = require("./routes/hotel/login")
const locationRoute = require("./routes/sherable/location")
const employeeRoute = require("./routes/hotel/employee/employee")
const propertyRoute = require("./routes/hotel/room/property")
mongoose
  .connect(process.env.DB_CONNECTION, { useNewUrlParser: true }) 
  .then(() => {
    console.log(`successfully connected`);
  })
  .catch((e) => {
    console.log(`not connected`);
  });

// mongoose.connect(process.env., {
//   userNewUrlParse: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
// });

// const connection = mongoose.connection;
// connection.once('open', ()=>{
// console.log("database connected :)");
// })

app.use('uploads/hotel/logo',express.static('uploads/hotel/logo'));
app.use(bodyParser.json());

//location route
app.use("/location", locationRoute);

//user route
app.use("/user", userRoute);
app.use("/account", accountRoute);
app.use("/login", loginRoute);

// hotel routes
app.use("/hotel", hotelRoute);
app.use("/hotelRating", hotelRatingRoute);
app.use('/hotelLogin',hotelloginRoute)
app.use('/employee',employeeRoute)

//room routes
app.use("/roomRating", roomRatingRoute);
app.use("/room", roomRoute);
app.use("/property", propertyRoute);

// reservations 
app.use("/payment", paymentRoute);
app.use("/roomReservation", roomReservationRoute);



// driver routes
app.use("/tripReservation", tripReservationRoute);
app.use("/trips", tripsRoute);
app.use("/vehicle", vehicleRoute);


app.listen(process.env.PORT)