const mongoose = require('mongoose');


const BillingSchema = new mongoose.Schema(
    {
        paymentMethod :{
            type: String,
            required: true,
            min: 3,
            max: 20,

        },
        paymentStatus :{
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        paymentDate :{
            type: String,
            required: true,
        },
        Amount :{
            type: String,
            required: true,
        }
        ,
        RoomNo :{
            type: String,
            required: true,
        },
        userId :{
            type: String,
            required: true,
        },
        

    },
    { timestamps: true }
);


module.exports = mongoose.model("Billing", BillingSchema);