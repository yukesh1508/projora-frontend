import React from "react";
import { Navigate } from "react-router-dom";

function UserProtectedRoute({ children }) {
  const userToken = localStorage.getItem("userToken");

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default UserProtectedRoute;