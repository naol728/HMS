import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/user/Home";
import MainLayout from "@/layouts/MainLayout";
import Rooms from "@/pages/user/Rooms";
import About from "@/pages/user/About";
import Login from "@/pages/user/Login";
import Signup from "@/pages/user/Signup";
import Contact from "@/pages/user/Contact";
import Book from "@/pages/user/Book";
import Profile from "@/pages/user/Profile";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import DashboardRooms from "@/pages/admin/Rooms";
import DashboardUsers from "@/pages/admin/Users";
import DashboardReservations from "@/pages/admin/Reservations";
import DashboardComments from "@/pages/admin/Comments";
import DashboardSettings from "@/pages/admin/Settings";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "@/store/features/userSlice";
import Roomdetail from "@/pages/user/Roomdetail";

export default function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Routes>
      {/* User Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<Roomdetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<Book />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard">
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<DashboardRooms />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="reservations" element={<DashboardReservations />} />
          <Route path="comments" element={<DashboardComments />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}
