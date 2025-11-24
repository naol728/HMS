import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "../mode-toggle";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  const isAdmin = user?.role === "admin";
  const isReception = user?.role === "reception";
  const isCustomer = user?.role === "customer";

  const navItems = [
    { name: "Home", path: "#/" },
    { name: "Rooms", path: "#rooms" },
    { name: "About", path: "#about" },
    { name: "Testimonial", path: "#testimonial" },
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
          {/* Anchor Nav */}
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {!user && (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}

            {isAdmin && (
              <Button asChild size="sm" variant="destructive">
                <Link to="/dashboard">Manager Dashboard</Link>
              </Button>
            )}
            {isReception && (
              <Button asChild size="sm" variant="secondary">
                <Link to="/reception">Reception Panel</Link>
              </Button>
            )}
            {isCustomer && (
              <Button asChild size="sm" variant="default">
                <Link to="/rooms">My Bookings</Link>
              </Button>
            )}

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
                  <a
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className="block text-foreground/80 hover:text-primary font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Auth & Role Buttons */}
            <div className="mt-6 space-y-3">
              {!user && (
                <>
                  <Button asChild fullWidth variant="outline">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild fullWidth>
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}

              {isAdmin && (
                <Button asChild fullWidth>
                  <Link to="/dashboard" onClick={() => setOpen(false)}>
                    Admin Dashboard
                  </Link>
                </Button>
              )}
              {isReception && (
                <Button asChild fullWidth>
                  <Link to="/reception" onClick={() => setOpen(false)}>
                    Reception Panel
                  </Link>
                </Button>
              )}
              {isCustomer && (
                <Button asChild fullWidth>
                  <Link to="/rooms" onClick={() => setOpen(false)}>
                    My Bookings
                  </Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
