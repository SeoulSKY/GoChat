import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import env from "react-dotenv";


let conn = new WebSocket("ws://" + env.GO_SERVER_HOST.replace("http://", "") + "/chat");


function App() {
  const [helloText, setHelloText] = useState("Connecting Go server...");

  useEffect(() => {
    fetch( env.GO_SERVER_HOST + "/hello")
        .then(response => response.text())
        .then(text => setHelloText(text))
        .catch(err => {
          console.log(err);
          setHelloText("Failed to connect to Go server");
        });

      conn.onmessage = (e) => {
          let json = JSON.parse(e.data)
          console.log(json)
      }
  }, []);

    function send() {
        conn.send(JSON.stringify({senderName: "myName", message: "myMessage"}))
    }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {helloText}
        </p>
          <button onClick={send}>Send</button>
      </header>
    </div>
  );
}

export default App;
