import React from 'react';
import { Routes, Route } from "react-router-dom";

// routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from './AuthProtected';

const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={<route.component />}
                        key={idx}
                    />
                ))}

                {/* Protected Routes */}
                {authProtectedRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={
                            <AuthProtected>
                                <route.component />
                            </AuthProtected>
                        }
                        key={idx}
                    />
                ))}
            </Routes>
        </React.Fragment>
    );
};

export default Index;
