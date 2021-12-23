import './App.css';
import env from "react-dotenv";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Profile from "./pages/Profile";
import ChatRoom from "./pages/ChatRoom";
import Cookies from "universal-cookie";

let conn = new WebSocket("ws" + env.GO_SERVER_HOST.replace("http", "") + "/chat");


function App() {
    const cookies = new Cookies();
    const hasName = cookies.get("name") !== undefined;

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path={"/profile"} element={<Profile/>}/>
                    <Route path={"/chatroom"} element={hasName ? <ChatRoom conn={conn}/> : <Navigate to={"/profile"}/>}/>
                    <Route path={"/"} element={<Navigate to={"/chatroom"}/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
