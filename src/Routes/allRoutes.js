import React from "react";

import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";
import Header from "../Layouts/Header";
import Category from "../pages/Category/Category";
import Product from "../pages/Products/Product"; 
import AddProduct from "../pages/Products/AddProduct";


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
  { path: "/Products", component: <Product /> },
  { path:"/AddProduct", component:<AddProduct /> },
  {path:"/editProduct/:id", element:<AddProduct /> }
  
];


export { authProtectedRoutes, publicRoutes };