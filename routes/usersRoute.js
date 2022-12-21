const router = require('express').Router();

const User = require('../models/users');
const Room = require('../models/rooms');
const Reservation = require('../models/Reservation');
const RoomCategory = require('../models/RoomCategory');

const bcrypt = require('bcryptjs');

// login View
router.get('/login', (req, resp) => { 
    resp.render('Login');
})
router.get('/register', (req, resp) => { 
    resp.render('Register');
})
router.get('/createRoom', (req, resp) => { 
    resp.render('admin/createRoom');
})
// home page
router.get('/', async (req, resp) => { 
    // 
    let rooms = await RoomCategory.find({})
    let userData = rooms.map((room , i) => { 
        if ( i < 3) {
            return room;
        }  
    })
    console.log(userData);
    resp.render('index',{rooms: userData});
})

// admin dashboard
router.get('/dashboard', (req, resp) => { 

    // total number of roomCategory
    let rooms = {}
    let RoomCategoryw={}
    RoomCategory.countDocuments({}, (err, count) => {
        if (err) {
            console.log(err);
        } else {
            RoomCategoryw = {count: count, name: 'Room Category'}
            console.log(count);
        }
    })
    // total number of rooms
    Room.countDocuments({}, (err, count) => {
        if (err) {
            console.log(err);
        } else {
          return  rooms = {count: count, name: 'Rooms'};
            // console.log(count);
        }
    })
    // total number of reservations
    Reservation.countDocuments({}, (err, count) => {
        if (err) {
            console.log(err);
        } else {
          return  tempdata.push({count: count, name: 'Reservations'});
            // console.log(count);
        }
    })
    // total number of users
  let data  = User.countDocuments({}, (err, count) => {
        if (err) {
            console.log(err);
        } else {
          return  tempdata.push({count: count, name: 'Users'});
            // console.log(count);
        }
    })
    // store the count in an array

    console.log(rooms, RoomCategoryw);


    resp.render('admin/dashboard', {data: tempdata});
})


// login user
router.post('/login', async (req, resp) => {
// Requiring module

// get user details from database
    // const user = await User.findOne({ email: req.body.email });
    
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        req.session.userId = user.id;
        req.session.name = user.name;
        req.session.email = user.email;
        req.session.phoneNumber = user.phoneNumber ? user.phoneNumber : '0912345678';
        req.session.role = user.isAdmin ? "admin" : "user"; 
    }
    else {
        resp.render('Login', {message :"incorrect login details"})
        // resp.send('User not found');
    }

    
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        // resp.send(user);
        if (user.isAdmin) {
            return  resp.redirect('/admin');
            
        } else {
            return resp.redirect('/');
        }

    }
    else {
        resp.render('Login', {message :"incorrect login details"})

        req.session.userId = null;
        req.session.name = null; ;    
        req.session.email = null;
        req.session.phoneNumber = null;
        req.session.role = null;

        // resp.send('Invalid email or password');
    }
    
});

// register a user 
router.post('/registerUser', async (req, resp) => {
    try {
        // hash password
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        if (req.body.password !== req.body.confirmPassword) {
            resp.render('Register', {message: "passwords do not match"});
        }
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: hashPassword
        });
        
       
        let result = await user.save();

        result = result.toObject();
        if (result) {
           
            resp.render('Login',{message: "You have Created an Account successfully"});
         

        } else {
            console.log('User already register');
        }
    } catch (e) {

        resp.send('Something Went Wrong' + e);
    }

})
// Getting user details
router.get('/getUsers', async (req, resp) => {
    try {
        const users = await User.find({});
      
       resp.render('admin/AllUsers', { users });
    } catch (error) {
        console.log(error);
    }
})
// serach user by name 
router.post('/searchUser', async (req, resp) => { 
    try {
        const users = await User.find({});
        let  filteredUsers = users.filter(user => user.name.toLowerCase().includes(req.body.name.toLowerCase()));
        resp.render('admin/AllUsers', { users : filteredUsers });
    } catch (error) {
        console.log(error);
    }
})
// getting user details by id
router.post('/getUser', async (req, resp) => {
    try {
        const user = await User.findById(req.body.id);

    let userRole = req.session.role;

        resp.render('EditUser', { user, userRole });
    } catch (error) {
        console.log(error);
    }
})
// update user details
router.post('/updateUser', async (req, resp) => {
    try {

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        let userDetails = {
            ...req.body,
            password: hashPassword
        }

        const user = await User.findByIdAndUpdate(req.body.id, userDetails);
        // update session
        req.session.name = user.name;
        req.session.email = user.email;
        req.session.phoneNumber = user.phoneNumber;
        req.session.role = user.isAdmin ? "admin" : "user";
        req.session.userId = user.id;
        resp.redirect('/');
    } catch (error) {
        console.log(error);
    }
})

// delete user details
router.post('/deleteUser', async (req, resp) => {
    try {
        const details = await User.findByIdAndDelete(req.body.id);

        if (details) {
            resp.redirect('/getUsers');
        }
       
    } catch (error) {

        console.log(error);
    }
})

module.exports = router;