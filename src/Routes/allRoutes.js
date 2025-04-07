import React from "react";

import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";
import Header from "../Layouts/Header";
import Category from "../pages/Category/Category";


const authProtectedRoutes = [
  {
    path: "/dashboard",
    exact: true,
    component: <Header />,
  },
  { path: "/changePassword", component: <ChangePassword /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/category", component: <Category /> },
];


export { authProtectedRoutes, publicRoutes };