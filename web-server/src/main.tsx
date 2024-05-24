import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Home from "./pages/Home.tsx";
import ChatRoom from "./pages/ChatRoom.tsx";
import Profile from "./pages/Profile.tsx";
import NavBar from "./components/NavBar.tsx";
import {UserContext} from "./utils/contexts.ts";
import {getUser, setUser as updateUser, User} from "./utils/user.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "chat",
        element: <ChatRoom />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ]
  },
]);

function Layout() {
  const [user, setUser] = useState<User>(getUser());

  return (
    <UserContext.Provider value={[user, (value: User) => {
      updateUser(value);
      setUser(value);
    }]}>
      <NavBar />
      <Outlet />
    </UserContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
