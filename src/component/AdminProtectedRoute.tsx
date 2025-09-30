import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  [key: string]: unknown;
}

const AdminProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem("token");

  let user: DecodedToken | null = null;
  if (token) {
    try {
      user = jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  // Check if user is logged in and has admin role
  if (!user || user.role !== 'admin') {
    // Redirect to login if not authenticated or not admin
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;