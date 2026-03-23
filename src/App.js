import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute";
import PageWrapper from "./components/PageWrapper";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Order from "./pages/Order";
import Demo from "./pages/Demo";
import AdminLogin from "./pages/AdminLogin";

import UserDashboard from "./dashboard/UserDashboard";
import ProjectStatus from "./dashboard/ProjectStatus"; // ✅ FIXED
import AdminDashboard from "./admin/AdminDashboard";
import ManageOrders from "./admin/ManageOrders";
import ExportOrders from "./admin/ExportOrders";


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />

        <Route
          path="/projects"
          element={
            <PageWrapper>
              <Projects />
            </PageWrapper>
          }
        />

        <Route
          path="/demo"
          element={
            <PageWrapper>
              <Demo />
            </PageWrapper>
          }
        />

        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />

        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />

        <Route
          path="/order"
          element={
            <UserProtectedRoute>
              <PageWrapper>
                <Order />
              </PageWrapper>
            </UserProtectedRoute>
          }
        />

        <Route
          path="/project-status"
          element={
            <UserProtectedRoute>
              <PageWrapper>
                <ProjectStatus />
              </PageWrapper>
            </UserProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <PageWrapper>
                <UserDashboard />
              </PageWrapper>
            </UserProtectedRoute>
          }
        />

        <Route
          path="/admin-login"
          element={
            <PageWrapper>
              <AdminLogin />
            </PageWrapper>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-orders"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <ManageOrders />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/export-orders"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <ExportOrders />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
       

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;