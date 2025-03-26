
import Login from "../pages/Authentication/Login";

const authProtectedRoutes = [

];

const publicRoutes = [
    {
        path: "/login",
        component: Login,
    },
];

export { authProtectedRoutes, publicRoutes };
