const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
    {
  
     roomNo :{
            type: String,
            required: true,
 },
       RoomCategoryId: {
       type: String,
        required: true,
        },
     roomStatus :{
            type: String,
            required: true,
              },
roomType: {
                     type: String,
                     required: true,
              },    
              RoomCategoryId: {
                     type: String,
                     required: true,

              },       
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rooms", RoomSchema);
