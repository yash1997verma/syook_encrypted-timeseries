//import booking model
const Booking = require('../models/booking');


const bookingController = {
    //add a new booking
    addBooking : async (req, res)=>{
        try{
            const bookingData = req.body;
            const newBooking = await Booking.create(bookingData);
            if(newBooking) return res.status(200).json(newBooking);
        }catch(err){
            return res.status(401).json({message: "unable to create new booking"});
        }
    },
    getBookings: async(req, res)=>{
        const user = req.user; 
        // Convert ObjectId to string
        const userIdString = user._id.toString();
        try{
            const allBookings = await Booking.find({userId: userIdString});
            return res.status(200).json({allBookings});
        }catch(err){
            return res.status(400);
        }
    },
   
}

module.exports = bookingController;