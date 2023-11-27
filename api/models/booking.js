const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    type:{//define if a doctor or nurse was booked
        type:String,
        enum:['doctor', 'nurse'],
        default: 'doctor',
        required: true,
    },
    date:{
        type: Date,
    },
    userId: {
        type: String,
        required: true,
    }

});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;


