import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Home from "./pages/Home.tsx";
import ChatRoom from "./pages/ChatRoom.tsx";
import Profile from "./pages/Profile.tsx";
import NavBar from "./components/NavBar.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      // {
      //   path: "chat",
      //   element: <ChatRoom />,
      // },
      // {
      //   path: "profile",
      //   element: <Profile />,
      // },
    ]
  },
]);

function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
