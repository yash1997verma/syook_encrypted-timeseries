const express = require('express');
const http = require('http');
const crypto = require('crypto');
const data = require('./data.json');
const socketIO = require('socket.io');
const cors = require('cors');

//setting up db
const db = require('./config/mongoose');

//import emitter and listner
const emitter = require('./services/emitter')
const listener = require('./services/listener')


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
    console.log(`Client connected on ${port}`);

    //setup listener
    listener.setupListener(socket)
    
    //handle disconnection
    socket.on('disconnected', ()=>{
        console.log('client disconnected');
    })
});

//setup emitter
emitter.setupEmitter(io);

server.listen(port, ()=>{
    try{
        console.log(`Server is running on port : ${port}`)
    }catch(err){
        console.log(`Error in starting server ${err}`);
    }
    
});





