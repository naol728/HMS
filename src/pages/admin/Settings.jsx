"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogOut, Lock, Mail, User } from "lucide-react";
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

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No user logged in.
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-lg shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20 border">
            <AvatarFallback className="bg-primary text-white text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl font-semibold">
              {user.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {user.role === "admin" ? "Administrator" : "Customer Account"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />
          <div className="space-y-3">
            <InfoRow
              icon={<Mail className="text-blue-500" />}
              label="Email"
              value={user.email}
            />
            <InfoRow
              icon={<User className="text-green-500" />}
              label="Role"
              value={user.role}
            />
            <InfoRow
              icon={<Lock className="text-yellow-500" />}
              label="Member Since"
              value={new Date(user.created_at).toLocaleDateString()}
            />
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleChangePassword}
            >
              <Lock className="w-4 h-4" />
              Change Password
            </Button>

            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-muted rounded-md">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
