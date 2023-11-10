import './App.css';
import { useEffect } from "react";
import { io } from "socket.io-client";
function App() {
  useEffect(()=>{
    //socket connection with the emitter service
    const socket  = io('http://localhost:8000');
    // console.log(socket)
    socket.on('dataStream', (stream) => {
      // Send the encrypted stream back to the listener service on the backend
      // for decryption, saving to the database, and broadcasting.
      socket.emit('recieveEncryptedStream', stream);
    });

    //clean the socket connection, when the component unmounts
    return ()=>{
      socket.disconnect();
    }

  },[])
  return (
    <div className="App">
      <h1>React app</h1>
    </div>
  );
}

export default App;
