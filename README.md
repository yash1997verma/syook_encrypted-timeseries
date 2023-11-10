# syook_encrypted_timeseries

## Intoduction
The project was created for submission to Syook, project implements a real-time data transmission and storage system using a combination of Node.js, Socket.IO, MongoDB, and a frontend React application. The system involves an emitter service that generates and transmits encrypted data streams, a listener service that decrypts and validates the data, and a frontend application that displays the real-time data along with success rates.

Note: The data available on front end is refreshed every 10 sec and new data is visible, the old data is deleted, deletion is done just to avoid running into a situation where db storage is full.

## API

### 1.Emitter Service
- The emitter service (found in `/api/services/emitter`) is responsible for generating random encrypted data streams at regular intervals.
- It uses Socket.IO to establish a WebSocket connection with the front end to send the data.
- Every data object or original messgage is created from the data.json file provided, the object contains random values selected from the given file, once the object is formed a secret key is attached to this object, to validate the values when data is decrypted.
- once the original message is ready they are encrypted, using AES-256-CTR, with every encrypted payload there is verctor attached which is iv, the vector is unique for all the messages, and helps in decryption part, there is also a secret key which remains same and is set as a enviroment variable in .env file.


### 2. Listener Service

- The listener service (found in `/api/services/listener`) decrypts the incoming data streams, validates the data integrity using a secret key, and stores validated data in a MongoDB collection.
- It utilizes Socket.IO to establish a bidirectional communication channel with the client.
- Validated data is timestamped and saved to a MongoDB collection designed for time-series data.

### 3. Frontend Application

- The frontend application (found in `/client`) is a React-based UI that connects to the listener service to receive real-time data updates.
- It uses Socket.IO to establish a WebSocket connection for receiving data updates.
- the emitter service provides data to front end which is relayed back to server for listener service.
- The front hears to the messages broadcasted by server and UI displays validated data in real-time and is refresher every 10 sec when a new stream comes.


### Prerequisites

- Node.js and npm installed
- MongoDB installed and running
- Environment variables configured, we need to configure messageKey and MONGO_URL in .env file, to make it work offline.


### Local Setup

1. Clone the repository:

  
   git clone https://github.com/yash1997verma/syook_encrypted-timeseries.git
   

2. Install dependencies:
    Perform for both front and backend
    npm install

3.  Start client and api
    cd client/
    npm start

    cd api/
    node index.js
    or 
    nodemon index.js

4. Access the app
    You can now access the app on 'http://localhost:3000'