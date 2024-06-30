// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
    const user = localStorage.getItem('user');

    return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
