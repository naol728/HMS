import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import MainLayout from "@/layouts/MainLayout";
import Rooms from "@/pages/Rooms";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Contact from "@/pages/Contact";
import Book from "@/pages/Book";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUser } from "@/store/features/userSlice";
import Profile from "@/pages/Profile";

export default function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<Book />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
