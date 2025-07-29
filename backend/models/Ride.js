const mongoose =require('mongoose');
const RideScheme =new mongoose.Schema(
    {
        rider:{
            type:mongoose.Schema.Types.ObjectId, ref:'User'
        },
        driver:{
            type:mongoose.Schema.Types.ObjectId, ref:'User'
        },
        pickup: String,
        dropoff: String,
        status:{
            type:String,
            enum:['requested','accepted','completed'],
            default:'requested'
        }
    }
);
module.exports =mongoose.model('Ride',RideSchema);
