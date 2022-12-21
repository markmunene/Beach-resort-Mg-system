const router = require('express').Router();

const User = require('../models/users');
const Room = require('../models/rooms');
const Reservation = require('../models/Reservation');
const Billing = require('../models/Billing');

// register a billing
router.post('/registerBilling', async (req, resp) => {
    try {
        const billing = new Billing(req.body);
        let result = await billing.save();
        result = result.toObject();
        if (result) {
            resp.send(req.body);
            console.log(result);
        } else {
            console.log('Billing already register');
        }
    } catch (e) {
        resp.send('Something Went Wrong' + e);
    }

})
// Getting billing details
router.get('/getBillings', async (req, resp) => {
    try {
        const details = await Billing.find({});
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
})
// getting billing details by id
router.get('/getBilling/:id', async (req, resp) => {
    try {
        const details = await Billing.findById(req.params.id);
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
})
// update billing details
router.put('/updateBilling/:id', async (req, resp) => {
    try {
        const details = await Billing.findByIdAndUpdate(req.params.id, req.body);
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
})

// delete billing details
router.delete('/deleteBilling/:id', async (req, resp) => {
    try {
        const details = await Billing.findByIdAndDelete(req.params.id);
        resp.send(details);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;