import React from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/api/auth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/features/userSlice";
import { Navigate, Link } from "react-router-dom";

export default function Profile() {
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    mutationKey: ["logoutUser"],
    onSuccess: () => {
      toast.success("Logged out successfully");
      dispatch(clearUser());
      window.location.href = "/";
    },
    onError: (error) => {
      toast.error(error.message || "Failed to Logout");
    },
  });

  if (!user) {
    return <Navigate to="/" replace={true} />;
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex justify-center py-16 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            {/* If you have a profile image, use AvatarImage */}
            {/* <AvatarImage src={user.avatarUrl} /> */}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription className="text-gray-500 text-center">
            {user.email}
          </CardDescription>
          <span className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-medium">
            {user.role}
          </span>
        </CardHeader>
        <CardContent className="flex justify-around gap-4 mt-6">
          <Link to="/reset-password">
            <Button>የይለፍ ቃል ቀይር</Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
          >
            ውጣ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
