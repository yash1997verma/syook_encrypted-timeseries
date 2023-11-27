const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bookingController  = require('../controllers/bookingController');
//import passport
require('../config/passport')


//add a booking
router.post('/addBooking', bookingController.addBooking);

//get all bookings
router.get('/getBookings', bookingController.getBookings );







module.exports = router;
