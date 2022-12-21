const router = require('express').Router();
const multer = require("multer");
const path = require("path");



const User = require('../models/users');
const Room = require('../models/rooms');
const Reservation = require('../models/Reservation');
const RoomCategory = require('../models/RoomCategory');
const { Router } = require('express');
const { log } = require('console');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploadedImages");
    },
    filename: function (req, file, callback) {
        
        callback(null,   req.body.roomType + '-' + Date.now() + path.extname(file.originalname));
      }
  });
const upload = multer({ storage: storage }).array("roomImages", 5);
  
// create Room View
router.get('/createRoom', (req, resp) => {
    resp.render('admin/createRoom');

})
// filter rooms
router.post('/filterRooms', async (req, resp) => {
    try {
        let rooms = await RoomCategory.find({})

        let roomTypes = rooms
    //    filter by roomType
        let tempRooms = [...rooms];
    
        if (req.body.roomType != "All") {
            
            tempRooms = tempRooms.filter(room => room.roomType == req.body.roomType)
        }
        // filter by capacity
        if (req.body.roomCapacity !== 1) {
            tempRooms = tempRooms.filter(room => Number(room.roomCapacity) >= Number(req.body.roomCapacity))
        }
        if ( req.body.roomCapacity !=="") {
             console.log(req.body.roomCapacity);
            tempRooms = tempRooms.filter(room => room.roomSize >= req.body.roomSize)
            
        }
        if (req.body.roomPrice !== "") {
            // console.log(req.body.roomPrice);
          
            tempRooms = tempRooms.filter(room => {
                if (Number(room.roomPrice) >= Number(req.body.roomPrice)) {
                    log(room.roomPrice);
                    return room;
                }
            })
           
        }
            
            

     
        resp.render('AllRooms', {rooms: tempRooms, roomTypes});
        // filter by all the above
       
        
    } catch (error) {
        console.log(error);
    
        
    }
 }) 

// create a room category
router.post('/searchRooms', async (req, resp) => {
    try {
        const room = await RoomCategory.find({});
        // filter rooms by room type
        const filteredRooms = room.filter((room) => room.roomType.toLowerCase().includes(req.body.roomType.toLowerCase()));

    // console.log(filteredRooms);

        resp.render('admin/AllRooms', { rooms: filteredRooms });
    } catch (error) {
        console.log(error);
    }
 })

router.post('/roomCategory', async (req, resp) => {
    try {
       
     // store image names in an array
        upload(req, resp,  async (err) =>{
            if (err) {
                console.log(err);
                return resp.end("Something went wrong!" + err);
            }
            // console.log(req, "reeeeeeeeeeeeeeeeeeeeeeeeeq");
            var imageNames = [];
            for (var i = 0; i < req.files.length; i++) {

                imageNames.push(req.files[i].filename);
            }
            let roomData = {
                roomType: req.body.roomType,
                roomPrice: req.body.roomPrice,
                roomDescription: req.body.roomDescription,
                roomImage: imageNames,
                roomSize: req.body.roomSize,
                RoomsAvailable: req.body.RoomsAvailable,
                roomCapacity: req.body.roomCapacity,
                petsAllowed: req.body.petsAllowed,
                Amenities: req.body.Amenities,
    
                }
            const roomCategory = new RoomCategory(roomData);
            let result = await roomCategory.save();
            result = result.toObject();
            // console.log(roomCategory);
            // create rooms for the room category
            for (let i = 0; i < Number(req.body.RoomsAvailable); i++) {
               
                let room = new Room({
                    RoomCategoryId: result._id,
                    roomType: req.body.roomType,
                    roomNo: req.body.roomType.substr(0,1) + i + 1,
                    roomStatus: "Available"
                })
                await room.save().then((room) => {
                    console.log(room);
                
                 }).catch((err) => { console.log(err) });
            }
            if (result) {
                resp.redirect('/roomCategory/adminCat');

            } else {
                console.log('Room already register');
            }
           
           
        })
 
    } catch (e) {
        
        resp.render('admin/CreateRoom',{message: e.message} );
    }


});
// Getting room category details
router.get('/', async (req, resp) => {
    try {
        const rooms = await RoomCategory.find({})
        // resp.send(rooms);
        resp.render('AllRooms', { rooms , roomTypes: rooms});
    } catch (error) {
        console.log(error);
    }
})
router.get('/adminCat', async (req, resp) => { 
    try {
        const rooms = await RoomCategory.find({});
       resp.render('admin/AllRooms', { rooms });
    } catch (error) {
        console.log(error);
    }
})

// getting room category details by id
router.get('/getRoomCategory/:id', async (req, resp) => {
    try {
        if (req.params.id.length == 24) {
           
            const room = await RoomCategory.findById(req.params.id.trim());
        
            resp.render('SingleRoom', { room , user: req.session.name});
            
        }
        else {
            resp.send('Invalid Room Id');
        }
        
        
    } catch (error) {
        console.log(error);
    }
})
// get single room category for edit
router.post('/getSingleCat', async (req, resp) => {
    try {
        let id = req.body.id
        const room = await RoomCategory.findById(id);
            
                resp.render('admin/EditRoomCategory', { room });
        
    } catch (error) {
        resp.send("Invalid id")
    }
})

// update room category details
router.post('/updateRoomCategory', async (req, resp) => {
    try {
        
        upload(req, resp,  async (err) =>{
            if (err) {
                console.log(err);
                return resp.end("Something went wrong!" + err);
            }
            // console.log(req, "reeeeeeeeeeeeeeeeeeeeeeeeeq");
            var imageNames = [];
            for (var i = 0; i < req.files.length; i++) {

                imageNames.push(req.files[i].filename);
            }
            let temproomCat = {
                roomType: req.body.roomType,
                roomPrice: req.body.roomPrice,
                roomDescription: req.body.roomDescription.trim(),
                roomCapacity: req.body.roomCapacity,
                petsAllowed: req.body.petsAllowed,
                Amenities: req.body.Amenities,
                RoomsAvailable: req.body.RoomsAvailable,
                roomSize: req.body.roomSize,
                roomStatus: req.body.roomStatus,
                
               
            }
            if (imageNames.length > 0) {
                temproomCat = {
                roomImage :imageNames,
                roomType: req.body.roomType,
                roomPrice: req.body.roomPrice,
                roomDescription: req.body.roomDescription.trim(),
                roomCapacity: req.body.roomCapacity,
                petsAllowed: req.body.petsAllowed,
                Amenities: req.body.Amenities,
                RoomsAvailable: req.body.RoomsAvailable,
                roomSize: req.body.roomSize,
                roomStatus: req.body.roomStatus,
               }
            }

        
           
            const details = await RoomCategory.findByIdAndUpdate(req.body.id, temproomCat).catch((err) => {
                console.log(err, "error");
            
             })
            if (details) {
                // resp.send('Room Category Updated Successfully');
                resp.redirect('roomCategory/adminCat');
                
                console.log(details);
            } else {
                resp.send('Room Category Not Updated');
            }
           
            // resp.redirect('/admin/Dashboard');
        })
        
    } catch (error) {
        console.log(error);
    }
})
// delete room category details
router.post('/deleteRoomCategory', async (req, resp) => {
    try {
        const details = await RoomCategory.findByIdAndDelete(req.body.id);
        if (details) {
            return resp.redirect('roomCategory/adminCat');
        } else {
        }
    } catch (error) {
        console.log(error);
    }
}
)
module.exports = router;




    

