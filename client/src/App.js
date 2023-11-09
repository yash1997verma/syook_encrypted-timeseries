import './App.css';
import { useEffect } from "react";
import { io } from "socket.io-client";
function App() {
  useEffect(()=>{
    const socket = io('http://localhost:8000');
    // console.log(socket)

  },[])
  return (
    <div className="App">
      <h1>React app</h1>
    </div>
  );
}

export default App;
