import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/features/userSlice";
import { registerUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { z } from "zod";

export default function Signup() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ---------------- ZOD SCHEMA ---------------- //
  const signupSchema = z
    .object({
      name: z
        .string()
        .min(1, "Name is required")
        .regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      toast.success("Account created successfully!");
      dispatch(setUser(user));
      window.location.href = "/";
    },
    onError: (error) => {
      const message = error?.message || String(error);

      if (message.includes("duplicate key") || message.includes("409")) {
        toast.error("An account with this email already exists.");
      } else {
        toast.error(message || "Registration failed");
      }
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate with Zod safely
    const result = signupSchema.safeParse(form);

    if (!result.success) {
      const msg = result.error.issues[0].message; // show the first error
      toast.error(msg);
      return;
    }

    mutation.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-background dark:via-background dark:to-muted px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-border">
        {/* Branding Header */}
        <CardHeader className="text-center space-y-2 pb-2">
          <CardTitle className="text-3xl font-extrabold text-primary">
            <Link to="/">Semayawi Hotel</Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Luxury • Comfort • Convenience
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-center mb-6">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              className="w-full rounded-md shadow-md hover:shadow-lg transition-all"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Signing up..." : "Sign Up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
