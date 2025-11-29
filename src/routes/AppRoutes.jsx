import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { fetchUser } from "@/store/features/userSlice";
import Landing from "@/pages/landing/Landing";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserLayout from "@/layouts/UserLayout";

// auth page
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import { DashboardRooms } from "@/pages/admin/Rooms";
import DashboardUsers from "@/pages/admin/Users";
import DashboardReservations from "@/pages/admin/Reservations";
import DashboardComments from "@/pages/admin/Comments";
import DashboardSettings from "@/pages/admin/Settings";
import DashboardLayout from "@/components/admin/DashboardLayout";

// user page
import Profile from "@/pages/user/Profile";
import Rooms from "@/pages/user/Rooms";
import Roomdetail from "@/pages/user/Roomdetail";
import UserRooms from "@/pages/user/UserRooms";
import Success from "@/pages/user/Success";
import UserReservation from "@/pages/user/UserReservation";
import ReservedRoomdetail from "@/pages/user/ReservedRoomdetail";
// reseption page
import ReseptionLayout from "@/components/reception/ReseptionLayout";
import Reseption from "@/pages/reception/Reseption";
import Reserveroom from "@/pages/reception/Reserveroom";
import PayReservation from "./../pages/reception/PayReservation";
import UpdateReservation from "@/pages/reception/UpdateReservation";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ChangePassword from "@/pages/auth/ChangePassword";

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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route element={<UserLayout />}>
        <Route element={<ProtectedRoute roles={["customer"]} />}>
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<Roomdetail />} />
          <Route path="/myreservation" element={<UserReservation />} />
          <Route
            path="/reservations/:roomid/:reservationid"
            element={<ReservedRoomdetail />}
          />
          <Route path="/myrooms" element={<UserRooms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/success" element={<Success />} />
        </Route>
      </Route>

      {/* reservation route */}
      <Route element={<ReseptionLayout />}>
        <Route element={<ProtectedRoute roles={["reception"]} />}>
          <Route path="/reception">
            <Route index element={<Reseption />} />
            <Route path="reserveroom" element={<Reserveroom />} />
            <Route path="payreservation" element={<PayReservation />} />
            <Route path="updatereserveroom" element={<UpdateReservation />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
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
    </Routes>
  );
}
