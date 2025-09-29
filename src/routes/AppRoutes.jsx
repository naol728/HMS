import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import { DashboardRooms } from "@/pages/admin/Rooms";
import DashboardUsers from "@/pages/admin/Users";
import DashboardReservations from "@/pages/admin/Reservations";
import DashboardComments from "@/pages/admin/Comments";
import DashboardSettings from "@/pages/admin/Settings";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "@/store/features/userSlice";

import Landing from "@/pages/landing/Landing";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* User Routes */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute roles={["customer"]} />}>
          <Route path="/rooms" element={<>user rooms shower</>} />
        </Route>
      </Route>

      {/* reservation route */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute roles={["reservation"]} />}>
          <Route path="/rooms" element={<>user rooms shower</>} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/dashboard">
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<DashboardRooms />} />
            <Route path="users" element={<DashboardUsers />} />
            <Route path="reservations" element={<DashboardReservations />} />
            <Route path="comments" element={<DashboardComments />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback Route */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}
