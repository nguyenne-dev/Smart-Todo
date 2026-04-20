import Login from "../page/auth/Login/index.jsx";
import Register from "../page/auth/Register/index.jsx";
import VerifyRegister from "../page/auth/VerifyRegister/index.jsx";
import Error404 from "../page/Error404/index.jsx";
import HomePage from "../page/Home/HomePage.jsx";

export const routes = [
  { path: "/", element: <HomePage /> },
  { path: "sign-in", element: <Login /> },
  { path: "sign-up", element: <Register /> },
  { path: "verify-register/:token", element: <VerifyRegister /> },
  { path: "verify-register/", element: <VerifyRegister /> },
  {
    path: "*",
    element: <Error404 />,
  },
];
