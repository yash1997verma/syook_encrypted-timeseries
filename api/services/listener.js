// listener.js
const crypto = require('crypto');

const setupListener = (socket) => {
    socket.on('recieveEncryptedStream', (stream) => {
        // Handle received encrypted stream
        // console.log('stream recieved');
    });
};

module.exports = {
    setupListener,
};