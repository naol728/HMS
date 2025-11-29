import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/features/userSlice";
import { loginUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Login() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      toast.success("Login successful!");
      dispatch(setUser(user));
      window.location.href = "/";
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
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
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <Button
              type="submit"
              className="w-full rounded-md shadow-md hover:shadow-lg transition-all"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Forgot your Password?{" "}
              <Link
                to="/forgot-password"
                className="text-primary hover:underline font-medium"
              >
                Forgot Password
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
