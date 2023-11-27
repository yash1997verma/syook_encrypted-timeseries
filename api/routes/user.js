const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken')
const userController = require('../controllers/userController');

//import passport
require('../config/passport')
//protected route
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json({ message: 'You have access to this protected route!' });
});

//get user data route
router.get('/getUserData', passport.authenticate('jwt', { session: false }), userController.getUserData);

//signUp route
router.post('/signUp', userController.signUp);
//signIn route
router.post('/signIn', userController.signIn);



module.exports = router;
