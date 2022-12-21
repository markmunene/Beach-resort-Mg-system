
const mongoose = require('mongoose');
// import userRoute
const userRoute = require('./routes/usersRoute');
const roomRoute = require('./routes/roomsRoute');
const reservationRoute = require('./routes/reservationRoute');
const RoomCategory = require('./routes/RoomCategory');
const billingRoute = require('./routes/billingRoute');
const path = require('path');
const oneDay = 1000 * 60 * 60 * 24;
const sessions= require('express-session');



mongoose.connect(
'mongodb://localhost:27017/',
{
	dbName: 'HotelBooking',
	useNewUrlParser: true,
	useUnifiedTopology: true,
},
(err) => (err ? console.log(err) :
	console.log('Connected to yourDB-name database')),
);


// For backend and express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')));
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { 
    secure: false, // This will only work if you have https enabled!
    maxAge: oneDay // 1 min
  },
  resave: false 
}));

// app.use('billing', billingRoute);
app.use('rooms', roomRoute);
app.use('/reservation', reservationRoute);
app.use(userRoute);
app.use('/roomCategory', RoomCategory);

app.get('/admin', (req, res) => {

  // check if user is logged in
  if (req.session.role == 'admin') {

    res.render('admin/sideBar');
  } else {
    res.redirect('/login');
  }

 })

// Server setup
app.listen(5000, () => {
console.log('App listen at port 5000');
});

// describe the database schema of this system ie what each schema should look like
// not code

// users schema has 




