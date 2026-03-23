import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const adminToken = localStorage.getItem("token");

  if (!adminToken) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedRoute;