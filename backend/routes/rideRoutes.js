const express =require('express');
const Ride =require('../models/Ride');
const router =express.Router();

router.post('/request',async(req,res) => {
    const {
        rider,
        pickup,
        dropoff
    } =req.body;
    const ride =new Ride(
        {
            rider,
            pickup,
            dropoff
        }
    );
    await ride.save();
    res.json(ride);
});

router.post('/accept/:rideId',async(req,res) => {
    const {
        driver
    } =req.body;
    const ride =await Ride.findByIdAndUpdate(req.params.rideId,
        {
            driver,
            status:'accepted'
        },
        {
            new :true
        }
    );
    res.json(ride);
});
// Inside your rideRoutes.js
const verifyToken = require('../middleware/auth');

router.get('/pending', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' }).populate('rider', 'name');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/driver/:driverId', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId })
      .populate('rider', 'name');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports =router;