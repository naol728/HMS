import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import ModeToggle from "./mode-toggle";
import { useSelector } from "react-redux";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Services", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  if (!user || !user.user) {
    navItems.push({ name: "Sign up", path: "/signup" });
    navItems.push({ name: "Login", path: "/login" });
  } else {
    navItems.push({ name: "Profile", path: "/profile" });
  }

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
        <ul className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary font-semibold underline underline-offset-4"
                    : "text-foreground/80 hover:text-primary transition-colors"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
          <li>
            <Button asChild size="sm" variant="default" className="shadow-sm">
              <Link to="/book">Book Now</Link>
            </Button>
          </li>
          {/* Theme Toggle */}
          <li>
            <ModeToggle />
          </li>
        </ul>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden">
            <Menu size={28} className="text-foreground" />
          </SheetTrigger>
          <SheetContent side="right" className="p-6 bg-background">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-primary">
                Semayawi Hotel
              </span>
              <ModeToggle />
            </div>
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? "text-primary font-semibold"
                        : "text-foreground/80 hover:text-primary transition-colors"
                    }
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
              <li>
                <Button asChild fullWidth variant="default" className="mt-4">
                  <Link to="/book">Book Now</Link>
                </Button>
              </li>
            </ul>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
