import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/home/HomePage";
import CarsPage from "../pages/cars/CarsPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UnauthorizedPage from "../pages/errors/UnauthorizedPage";
import CarDetailsPage from "../pages/cars/CarDetailsPage";
import MyBookingsPage from "../pages/bookings/MyBookingsPage";
import ProtectedRoute from "./ProtectedRoute";



export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/bookings" element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>}
        />
        <Route path="/cars" element={
          <ProtectedRoute>
            <CarsPage />
          </ProtectedRoute>}
        />
        <Route
          path="/cars/:id"
          element={
            <ProtectedRoute>
              <CarDetailsPage />
            </ProtectedRoute>
          }
        />




      </Route>
    </Routes>
  );
}
