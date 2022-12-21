const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema(
    {
        roomNo :{
            type: String,
            default: 'none',
            min: 3,
            max: 20,
        },
        RoomCategoryId: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        noOfRooms: {
            type: Number,
            default: 1,
        },
        totalprice: {
            type: Number,
            default: 0,
        },
        checkIn :{
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        checkOut :{
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        userId :{
            type: String,
            required: true,
        },
        status :{
            type: String,
            default: 'pending',
        },
},
    { timestamps: true }
);


module.exports = mongoose.model("Reservation", ReservationSchema);