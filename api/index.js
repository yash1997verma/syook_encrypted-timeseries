const express = require('express');
const app = express ();
const port = 8000;
const passport = require('passport');

//cors
const cors = require('cors');
//setting up cors middleware
app.use(cors());

//setting up passport middleware
app.use(passport.initialize());
// app.use(passport.session());

//setting up db
const db = require('./config/mongoose');

//middleware to parse json and url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use express router
app.use('/', require('./routes'));

app.listen(port, (err)=>{
    if(err){
        console.log(`error in starting server ${err}`);
    }
    console.log(`Server is running on ${port}`);
})