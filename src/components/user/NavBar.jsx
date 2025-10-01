"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import ModeToggle from "../mode-toggle";

export default function UserNavbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Rooms", path: "/rooms" },
    { name: "My Reservation", path: "/myreservation" },
    { name: "My Rooms", path: "/myrooms" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-primary tracking-tight hover:opacity-90 transition"
        >
          Semayawi Hotel
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Nav Links */}
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `text-foreground/80 hover:text-primary transition-colors font-medium ${
                      isActive ? "text-primary font-semibold" : ""
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <Button size="sm" variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <Menu size={28} className="text-foreground" />
          </SheetTrigger>
          <SheetContent side="right" className="p-6 bg-background">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-primary">
                Semayawi Hotel
              </span>
              <ModeToggle />
            </div>

            {/* Nav Links */}
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block text-foreground/80 hover:text-primary font-medium transition-colors ${
                        isActive ? "text-primary font-semibold" : ""
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Bottom Logout */}
            <div className="mt-6 space-y-3">
              <Button asChild fullWidth variant="outline" className="gap-2">
                <Link to="/logout" onClick={() => setOpen(false)}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
