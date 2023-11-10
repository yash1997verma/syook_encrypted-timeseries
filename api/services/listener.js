const crypto = require('crypto');
const moment = require('moment');
const DataModel = require('../models/dataModel');
// get messagekey, same as emitter
const messageKey = Buffer.from(process.env.messageKey, 'hex');



const setupListener = (socket) => {
    socket.on('recieveEncryptedStream', async (stream) => {
        // Split the stream into individual messages
        const messages = stream.split('|');
        // Extract IV and encrypted data from each message
        const separatedMessages = messages.map(message => {
            const [iv, encryptedData] = message.split(':');
            return { iv, encryptedData };
        });

        // Use Promise.all to wait for all promises to resolve
        try {
            const decryptedData = await Promise.all(separatedMessages.map(async (message) => {
                let iv = Buffer.from(message.iv, 'hex');
                let encryptedPayload = Buffer.from(message.encryptedData, 'hex');
                let decipher = crypto.createDecipheriv('aes-256-ctr', messageKey, iv);

                let decrypted = decipher.update(encryptedPayload, 'buffer', 'utf-8');
                decrypted += decipher.final('utf-8');
                const decryptedObject = JSON.parse(decrypted);

                // Validate the objects
                // Calculate hash
                const calculatedHash = crypto.createHash('sha256')
                    .update(JSON.stringify({
                        name: decryptedObject.name,
                        origin: decryptedObject.origin,
                        destination: decryptedObject.destination
                    }))
                    .digest('hex');

                // Match hash and secret key
                if (calculatedHash === decryptedObject.secret_key) {
                    // Add timestamp and save to MongoDB
                    await DataModel.create({
                        name: decryptedObject.name,
                        origin: decryptedObject.origin,
                        destination: decryptedObject.destination,
                        timestamp: moment().toDate(),
                        secret_key: decryptedObject.secret_key,
                    });
                } else {
                    console.log('Data integrity check failed!');
                }
            }));

            // Fetch the data from MongoDB
            const fetchedData = await DataModel.find({});

            // Broadcast the fetched data back to the emitter
            socket.emit('broadcastFetchedData', fetchedData);
        } catch (error) {
            console.error('Error processing encrypted stream:', error);
        }
    });
};

module.exports = {
    setupListener,
};
