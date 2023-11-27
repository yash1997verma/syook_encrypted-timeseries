const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
//import passport
require('../config/passport')

router.get('/', (req,res)=>{
    res.json('Welcome to API');
});

//user route
router.use('/user', require('./user'))
// router.post('/')
//booking route
router.use('/booking',passport.authenticate('jwt', { session: false }), require('./booking'));

module.exports  = router;