import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Home from "./pages/Home.tsx";
import ChatRoom from "./pages/ChatRoom.tsx";
import Account from "./pages/Account.tsx";
import NavBar from "./components/NavBar.tsx";
import {NavContext, UserContext} from "./utils/contexts.ts";
import {getUser, setUser as updateUser, User} from "./utils/user.ts";
import {Bounce, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./pages/SignIn.tsx";

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
        path: "account",
        element: <Account />,
      },
      {
        path: "signin",
        element: <SignIn />,
      }
    ]
  },
]);

function Layout() {
  const [user, setUser] = useState<User>(getUser());
  const navRef = useRef<HTMLElement>(null);
  const [isNavMounted, setIsNavMounted] = useState(false);

  useEffect(() => {
    if (navRef.current) {
      setIsNavMounted(true);
    }
  }, [navRef.current]);

  return (
    <UserContext.Provider value={[user, (value: User) => {
      updateUser(value);
      setUser(value);
    }]}>
      <NavContext.Provider value={navRef}>
        <NavBar ref={navRef}/>
        {isNavMounted && <Outlet />}
        <ToastContainer transition={Bounce} />
      </NavContext.Provider>
    </UserContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
