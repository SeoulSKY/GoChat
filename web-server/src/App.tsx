import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import env from "react-dotenv";

function App() {
  const [helloText, setHelloText] = useState("Connecting Go server...");

  useEffect(() => {
    fetch( env.GO_SERVER_HOST + "hello")
        .then(response => response.text())
        .then(text => setHelloText(text))
        .catch(err => {
          console.log(err);
          setHelloText("Failed to connect to Go server");
        });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {helloText}
        </p>
      </header>
    </div>
  );
}

export default App;
