import UserNavbar from "@/components/user/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <UserNavbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Semayawi Hotel. All rights reserved.
      </footer>
    </div>
  );
}
