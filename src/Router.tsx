import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Messages from "./Messages/Messages";
import Settings from "./Pages/Settings";
import Login from "./Login/Login";
import AdminHome from "./Pages/Admin Pages/AdminHome";
import Home from "./Pages/User Pages/Home";
import MembersHome from "./Pages/Admin Pages/MembersHome";
import SignUp from "./Login/SignUp";
import ForgotPassword from "./Login/ForgotPassword";
import TokenCheck from "./Components/TokenCheck";
import ErrorPage from "./Components/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TokenCheck>
        <Layout />
      </TokenCheck>
    ),
    children: [
      { path: "/admin", element: <AdminHome /> },
      { path: "/home", element: <Home /> },
      { path: "/settings", element: <Settings /> },
      { path: "/messages", element: <Messages /> },
      {
        path: "/admin/members", //Only for admin
        element: <MembersHome />,
      },
    ],
  },

  {
    path: "/settings",
    element: (
      <TokenCheck>
        <Settings />
      </TokenCheck>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/mock",
    // element: <ProgressiveCircleBar />,
  },
  {
    path: "/*",
    element: <ErrorPage />,
  },
]);

export { router };
