import React from "react";
import Navbar from "@/components/landing/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "@/components/landing/Footer";
import { Toaster } from "sonner";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" theme="dark" />
    </div>
  );
}
