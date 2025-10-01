"use client";

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function UserNavbar() {
  const navLinks = [
    { name: "Rooms", path: "/rooms" },
    { name: "My Rooms", path: "/myrooms" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-50 shadow-sm">
      <div className="container px-3 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl tracking-tight text-primary">
          Semayawi Hotel
        </Link>

        {/* Centered Desktop nav */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right side (optional for user actions) */}
        <div className="hidden md:flex items-center gap-2">
          <Button size="sm" variant="outline">
            Logout
          </Button>
        </div>

        {/* Mobile nav (Sheet / Drawer) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6">
            <div className="flex flex-col h-full">
              {/* Mobile Logo */}
              <Link
                to="/"
                className="font-bold text-lg text-primary mb-6"
                onClick={() => document.body.click()} // close drawer after click
              >
                Semayawi Hotel
              </Link>

              {/* Nav Links */}
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-base font-medium transition-colors hover:text-primary ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              {/* Bottom logout */}
              <div className="mt-auto pt-6">
                <Button variant="outline" className="w-full">
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
