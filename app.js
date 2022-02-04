const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


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
const employeeLoginRoute = require("./routes/hotel/employee/login")
const propertyRoute = require("./routes/hotel/room/property");
const userNotificationRoute = require("./routes/notifications/userNotification");
const driverNotificationRoute = require("./routes/notifications/driverNotification");
const hotelNotificationRoute = require("./routes/notifications/hotelNotification");
const adminNotificationRoute = require("./routes/notifications/adminNotification");

 //==========================================================================
// Database connection
//==========================================================================
//----------------------------------------------------------------------------

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`Server is online`);
    console.log({
      status: 'Successful',
      message: 'Server is online'
    })
  })
  .catch((e) => {
    console.log({
      status: 'Failed',
      message: 'Server is currently Offline. Please try againe in a moment'
    })
  });


  //==========================================================================
// End
//==========================================================================
//----------------------------------------------------------------------------



//==========================================================================
// Middlewears
//==========================================================================
app.use(cors());
app.use('uploads/hotel/logo', express.static('uploads/hotel/logo'));
app.use(bodyParser.json({limit: '1000mb'}));

//location route
app.use("/location", locationRoute);

//user route
app.use("/user", userRoute);
app.use("/account", accountRoute);
app.use("/login", loginRoute);

// hotel routes
app.use("/hotel", hotelRoute);
app.use("/hotelRating", hotelRatingRoute);
app.use('/hotelLogin', hotelloginRoute)
app.use('/employee', employeeRoute)
app.use('/employeeLogin', employeeLoginRoute)

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

// driver routes
app.use("/userNotifications", userNotificationRoute);
app.use("/driverNotifications", driverNotificationRoute);
app.use("/hotelNotifications", hotelNotificationRoute);
app.use("/adminNotifications", adminNotificationRoute);

//==========================================================================
// End
//==========================================================================
//----------------------------------------------------------------------------

//==========================================================================
// App listons 
//==========================================================================

app.listen(process.env.PORT)

//==========================================================================
// End
//==========================================================================
//----------------------------------------------------------------------------
