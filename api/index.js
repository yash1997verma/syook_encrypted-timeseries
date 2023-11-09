const express = require('express');
const http = require('http');
const crypto = require('crypto');
const data = require('./data.json');
const socketIO = require('socket.io');
const cors = require('cors');

// http server
const app = express();
const server = http.createServer(app);
const port = 8000;

//setup socket server using http server
const io = new socketIO.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

//setup socket.io
io.on('connection', (socket)=>{
    console.log('client connected');

    //handle disconnection
    socket.on('disconnected', ()=>{
        console.log('client disconnected');
    })
})

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

const messageKey = crypto.randomBytes(32);

//genrate a encrypted stream from collection of messages
const encryptedStream = ()=>{
    //any no. between 49-499
    const numMessages = Math.floor(Math.random() * (499 - 49 + 1) + 49); 
    const messages = [];

    for(let i = 0; i<numMessages; i++){
        const payloadString = randomMessage();
        const key = messageKey; 

        //create and aes-256-ctr cipher with the passphrase
        const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(key), crypto.randomBytes(16));
        
        //encrypt the payload 
        let encryptedMessage = cipher.update(payloadString, 'utf-8', 'hex');
        encryptedMessage += cipher.final('hex');
        messages.push(encryptedMessage);
    }

    // Concatenate the encrypted messages into a single string separated by '|'
    const stream = messages.join('|');
    
    return stream;
}


//emit a random message over the WebSocket connection
const emitRandomMessage = () => {
    const stream = encryptedStream();
    // console.log(stream);
    io.emit('dataStream', JSON.stringify(stream));
};




//emmit the encrypted stream every 10 sec
setInterval(()=>{
    emitRandomMessage();
},10000);









server.listen(port, ()=>{
try{
    console.log(`Server is running on port : ${port}`)
    }catch(err){
    console.log(`Error in starting server ${err}`);
    }
    
})

