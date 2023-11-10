const crypto = require('crypto');
const data = require('../data.json');
require('dotenv').config();
const DataModel = require('../models/dataModel')
//for genrating random message with secret_key attached
const randomMessage = ()=>{
    const randomNameIndex = Math.floor(Math.random() * data.names.length);
    const randomOriginIndex = Math.floor(Math.random() * data.cities.length);
    const randomDestinationIndex = Math.floor(Math.random()* data.cities.length);

    //create original message
    const originalMessage = {
        name: data.names[randomNameIndex],
        origin: data.cities[randomOriginIndex],
        destination: data.cities[randomDestinationIndex]
    };

    // calculate SHA-256 hash of the original message
    const secretKey = crypto.createHash('sha256').update(JSON.stringify(originalMessage)).digest('hex');

    // add secret key to the original message
    const sumCheckMessage = {
        ...originalMessage,
        secret_key: secretKey,
    };

    const messageString = JSON.stringify(sumCheckMessage);

    return messageString;

}

// Function to delete all old data from previos stream
//doing this to not go in a condition where we run out of storage
const deleteAllOldData = async () => {
    try {
      await DataModel.deleteMany({});
    //   console.log('All old data deleted successfully.');
    } catch (error) {
      console.error('Error deleting old data:', error);
    }
};

//get messagekey
const messageKey = Buffer.from(process.env.messageKey, 'hex');

//genrate a encrypted stream from collection of messages
const encryptedStream = ()=>{
    //delete data from old stream
    deleteAllOldData();
    //any no. between 49-499
    const numMessages = Math.floor(Math.random() * (499 - 49 + 1) + 49); 
    const messages = [];


    const iv = crypto.randomBytes(16);
    const text = randomMessage();
    let cipher = crypto.createCipheriv('aes-256-ctr', messageKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };

    for(let i = 0; i<numMessages; i++){
        // generate a random IV, unique for every message
        const iv = crypto.randomBytes(16);
        
        const payloadString = randomMessage();
         
        //create and aes-256-ctr cipher with the passphrase
        const cipher = crypto.createCipheriv('aes-256-ctr',messageKey, iv);
        
        //encrypt the payload 
        let encrypted = cipher.update(payloadString);
        encrypted = Buffer.concat([encrypted, cipher.final()]) ;

        // concatenate the IV and encrypted message
        //we need to incrlude IV with message so that same can be used for decrypt
        //key can be same, but iv has to be diff for all messages
        const message = {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
        const messageString = `${message.iv}:${message.encryptedData}`
        messages.push(messageString);
    }

    // Concatenate the encrypted messages into a single string separated by '|'
    const stream = messages.join('|');
    // console.log(stream)
    return stream;
}


//emit a random message over the WebSocket connection
const emitRandomMessage = (io) => {
    const stream = encryptedStream();
    

    io.emit('dataStream', stream);
   
};



//setup emitter
const setupEmitter = (io) => {
    setInterval(() => {
        emitRandomMessage(io);
    }, 6000);
};

module.exports = {
    setupEmitter,
};