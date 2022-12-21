const router = require('express').Router();

const User = require('../models/users');
const Room = require('../models/rooms');
const Reservation = require('../models/Reservation');


// Register a room
router.post('/room', async (req, resp) => {
    try {
        const room = new Room(req.body);
        let result = await room.save();
        result = result.toObject();
        if (result) {
            resp.send(req.body);
            console.log(result);
        } else {
            console.log('Room already register');
        }
    } catch (e) {
        resp.send('Something Went Wrong' + e);
    }

})
// Getting room details
router.get('/getRooms', async (req, resp) => {
    try {
        const details = await Room.find({});
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
})
// getting room details by id
router.get('/getRoom/:id', async (req, resp) => {
    try {
        const details = await Room.findById(req.params.id);
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
})

// update room details
router.put('/updateRoom/:id', async (req, resp) => {
    try {
        const details = await Room.findByIdAndUpdate(req.params.id, req.body);
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
})
// delete room details
router.delete('/deleteRoom/:id', async (req, resp) => {
    try {
        const details = await Room.findByIdAndDelete(req.params.id);
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;