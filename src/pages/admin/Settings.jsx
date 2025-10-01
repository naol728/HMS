"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { clearUser } from "@/store/features/userSlice";
import { logoutUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";

export default function DashboardSettings() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    dispatch(clearUser());
    navigate("/");
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No user logged in.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Role:</span> {user.role}
          </p>

          <Button
            variant="destructive"
            className="mt-4 flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
