import './App.css';
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
function App() {
  const [dataState, setDataState] = useState([]);
  useEffect(()=>{
    //socket connection with the emitter service
    // https://timeapi.onrender.com
    const socket  = io('http://localhost:8000');
 
    socket.on('dataStream', (stream) => {
      // Send the encrypted stream back to the listener service on the backend
      // for decryption, saving to the database, and broadcasting.
      socket.emit('recieveEncryptedStream', stream);
    });

    //get the validated data from backend
    socket.on('broadcastFetchedData', (data)=>{
      console.log(data)
      setDataState(data);
    })

    //clean the socket connection, when the component unmounts
    return ()=>{
      socket.disconnect();
    }

  },[])
  return (
    <div className="App">
      {dataState.map((data) => {
        // Render your data details here
        return (
          <div key={data._id}>
            <p>Name: {data.name}</p>
            <p>Origin: {data.origin}</p>
            <p>Destination: {data.destination}</p>
            <p>Timestamp: {data.timestamp}</p>
            
          </div>
        );
      })}
    </div>
  );
}

export default App;
