const mongoose = require('mongoose');
require('dotenv').config();

async function main(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to db`);
    }catch(err){
        console.log(`error in connecting to db ${err}`);
    }
}


main();