"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("Password reset session:", session);
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message, {
        description: "Something went wrong. Try again.",
      });
    } else {
      toast.success("Password updated successfully!", {
        description: "You can now log in with your new password.",
      });
      navigate("/");
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

        <form onSubmit={handleUpdate} className="flex gap-5 flex-col">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold text-center mb-6">
              Set New Password
            </h2>
            <p className="text-center">
              Enter your new password to complete the reset process.
            </p>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" type="submit">
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
