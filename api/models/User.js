const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define user Schema 
const userSchema = new Schema({
    username: {
        type: String, 
        required: true,
    },
    phone:{
        type: Number,
        required:true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String, 
        required: true,
        unique: true,
    },
});


const User = mongoose.model('User', userSchema);

module.exports = User;
