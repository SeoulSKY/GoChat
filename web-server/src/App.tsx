import './App.css';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Profile from "./pages/Profile";
import ChatRoom from "./pages/ChatRoom";
import { cookies } from "./global";
import NavBar from './components/NavBar';


function App() {
    const hasName = cookies.get("name") !== undefined;

    return (
        <div className="App">
            <BrowserRouter>
                <NavBar/>
                <Routes>
                    <Route path={"/profile"} element={<Profile />} />
                    <Route path={"/chatroom"} element={hasName ? <ChatRoom/> : <Navigate to={"/profile"} />} />
                    <Route path={"/"} element={<Navigate to={"/chatroom"} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
