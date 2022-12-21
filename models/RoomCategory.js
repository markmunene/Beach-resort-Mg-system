const mongoose = require('mongoose');

const RoomCategorySchema = new mongoose.Schema(
    {
        roomType: {
            type: String,
            required: true,
            unique: true,
            min: 3,
            max: 20,
        },
        RoomsAvailable: {
            type:String,
            required: true,
           
        },
        roomPrice: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        roomCapacity: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        roomSize: {
            type: String,
            required: true,
            min: 3,
            max: 20,

        },
        roomDescription: {
            type: String,
            required: true,
            min: 3,
            max: 200,
        },
        roomImage: {
            type: Array,
            required: true,

        },
        roomStatus: {
            type: String,

           default: "Available",
            min: 3,
            max: 20,
        },
        petsAllowed: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        }
        ,
        Amenities: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        }

    },
    { timestamps: true }
)


module.exports = mongoose.model("RoomCategory", RoomCategorySchema);


