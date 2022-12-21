const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
   
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      min: 9,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default:"none", 
      required:true,
    },
  
   
    isAdmin: {
      type: Boolean,
      default: true,
    },
    desc: {
      type: String,
      default: "",
      max: 50,
    },
   
  },
  { timestamps: true }
);
// // generate dump data using this schema



module.exports = mongoose.model("User", UserSchema);