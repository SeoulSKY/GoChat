import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Profile from "./pages/Profile";
import ChatRoom from "./pages/ChatRoom";
import { cookies } from "./global";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";


export default function App() {
  const hasName = cookies.get("name") !== undefined;

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        {/*<Route path={"/profile"} element={hasName ? <Profile /> : <Navigate to={"/"} />} />*/}
        {/*<Route path={"/chatroom"} element={hasName ? <ChatRoom/> : <Navigate to={"/"} />} />*/}
        <Route path={"/"} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
