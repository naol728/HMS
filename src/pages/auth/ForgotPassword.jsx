"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      toast.error(error.message, {
        description: "Please check the email and try again.",
      });
    } else {
      toast.success("Password reset email sent!", {
        description: "Check your inbox for further instructions.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-background dark:via-background dark:to-muted px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-border">
        <CardHeader className="text-center space-y-2 pb-2">
          <CardTitle className="text-3xl font-extrabold text-primary">
            <Link to="/">Semayawi Hotel</Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Luxury • Comfort • Convenience
          </p>
        </CardHeader>

        <form onSubmit={handleReset} className="flex gap-5 flex-col">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-6">
              Forgot Password
            </h2>
            <p className="text-center">
              Enter your email and we'll send password reset instructions.
            </p>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" type="submit">
              Send Reset Email
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
