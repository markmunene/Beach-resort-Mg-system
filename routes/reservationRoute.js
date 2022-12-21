const Router = require('express').Router();
const User = require('../models/users');
const Room = require('../models/rooms');
const RoomCategory = require('../models/RoomCategory');
const Reservation = require('../models/Reservation');

// register a reservation
Router.post('/', async (req, resp) => {
    try {
        let rooms = await Room.find({ roomType: req.body.roomType});
        let choosenRoom = rooms.filter(room => room.roomStatus == "Available");

        if (req.body.checkIn < req.body.checkOut && choosenRoom.length !== 0) {

            // calculate the total price from checkin to checkout and noofRooms
            let totalDays = (new Date(req.body.checkOut) - new Date(req.body.checkIn)) / (1000 * 60 * 60 * 24);
            let totalPrice = totalDays * Number(req.body.price) * Number(req.body.noOfRooms);

            let reservationData = {
                ...req.body,
                userId: req.session.id,
                roomNo: choosenRoom[0].roomNo,
                noOfRooms: req.body.noOfRooms,
                totalprice: totalPrice,
            }
            // update room status
            let roomData = await Room.findByIdAndUpdate(choosenRoom[0]._id, { roomStatus: "reserved" });
       
            const reservation = new Reservation(reservationData);
            let result = await reservation.save();
            result = result.toObject();
            if (result) {
                resp.status(200).send(result);
                console.log(result);
            } else {
                console.log('Reservation already register');
            }
        } else {
            // checkin date is after checkout date
            // throw error
            resp.status(400).send("no room available");
        }
    } catch (e) {
        resp.send('Something Went Wrong' + e);
    }

})
// Getting reservation details by user id
Router.get('/profile', async (req, resp) => {
    try {
        const details = await Reservation.findOne({ userId: req.session.userId });
        console.log(details, 'details', req.session.userId);
        let userData  = {
            name: req.session.name,
            email: req.session.email,
            phoneNumber: req.session.phoneNumber ? req.session.phoneNumber : '0912345678',
            userId: req.session.userId,
        }
        if (details) {
            resp.render('setting', { userData, rsvp : details });
        } else {
            resp.render('Login');
        }

        
    } catch (error) {
        console.log(error);
    }
})
// Getting reservation details
Router.get('/getReservations', async (req, resp) => {
    try {
        const reservations = await Reservation.find({});
            // fetch user  name and phoneNumber where userId = reservation.userId
        let reservationsData = [];
        for (let i = 0; i < reservations.length; i++) {
            const user = await User.findOne({ _id: reservations[i].userId });
            // fetch roomType and price where  = reservation.RoomCategoryId
            const room = await RoomCategory.findOne({ _id: reservations[i].RoomCategoryId });

            reservationsData.push({
                ...reservations[i].toObject(),
                name: user.name,
                phoneNumber: user.phoneNumber,
                roomType: room.roomType,
                
            });
        }
      
        resp.render('admin/AllReservation', { reservations : reservationsData });
    } catch (error) {
        console.log(error);
    }
})

// change reservation status
Router.post('/changeStatus', async (req, resp) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.body.id, { status: req.body.status });
        if (reservation) {
           resp.redirect('/reservation/getReservations');
        } else {
            resp.redirect('/reservation/getReservations');
        }
    } catch (error) {
        console.log(error);
    }
})

// checkout a user
Router.post('/checkout', async (req, resp) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(req.body.id, { status: req.body.status });
        if (reservation) {
            // update room status
            let roomData = await Room.findOneAndUpdate({ roomNo: reservation.roomNo }, { roomStatus: "Available" });    
            resp.redirect('/reservation/getReservations');
        } else {
            resp.redirect('/reservation/getReservations');
           
        }
    } catch (error) {
        console.log(error);
    }
})



// serach reservation by customer name
Router.post('/search', async (req, resp) => { 
    try {
        const reservations = await Reservation.find({});
        let reservationsData = [];
        for (let i = 0; i < reservations.length; i++) {
            const user = await User.findOne({ _id: reservations[i].userId });
            // fetch roomType and price where  = reservation.RoomCategoryId
            const room = await RoomCategory.findOne({ _id: reservations[i].RoomCategoryId });

            reservationsData.push({
                ...reservations[i].toObject(),
                name: user.name,
                phoneNumber: user.phoneNumber,
                roomType: room.roomType,
            
            });
        }
        let filterData = reservationsData.filter((item) => {
            return item.name.toLowerCase().includes(req.body.name.toLowerCase());
        });
        resp.render('admin/AllReservation', { reservations: filterData });
    } catch (error) {
        console.log(error);
    }
})

// update reservation details
Router.put('/updateReservation/:id', async (req, resp) => {
    try {
        const details = await Reservation.findByIdAndUpdate(req.params.id, req.body);
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
}
)
// profile rout
// admin delete reservation


// delete reservation details
Router.post('/deleteReservation', async (req, resp) => {
    try {
        let id  = req.body.id;
        const details = await Reservation.findByIdAndDelete(id);

        // console.log(id, 'iddddddddddddddddd');
        resp.redirect('/reservation/profile');
    } catch (error) {
        console.log(error);
    }
})
Router.post('/delete', async (req, resp) => {
    try {
        let id  = req.body.id;
        const details = await Reservation.findByIdAndDelete(id);

        // console.log(id, 'iddddddddddddddddd');
        resp.redirect('/reservation/getReservations');
    } catch (error) {
        console.log(error);
    }
})

module.exports = Router;