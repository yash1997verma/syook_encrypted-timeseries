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

//for genrating random message
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

    return originalMessage;
}


//emit a random message over the WebSocket connection
const emitRandomMessage = () => {
    const message = randomMessage();
    io.emit('dataStream', JSON.stringify(message));
};




//emmit the encrypted stream every 10 sec
setInterval(()=>{
    emitRandomMessage();
},1000);









server.listen(port, ()=>{
try{
    console.log(`Server is running on port : ${port}`)
    }catch(err){
    console.log(`Error in starting server ${err}`);
    }
    
})

