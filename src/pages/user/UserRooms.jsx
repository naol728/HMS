import useUserRoom from "@/hooks/room/useUserRoom";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, DollarSign, BedDouble } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserRooms() {
  const { userrooms, userroomerr, userroomloading } = useUserRoom();

  if (userroomloading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Loading your reservations...
        </span>
      </div>
    );
  }

  if (userroomerr) {
    return (
      <div className="text-red-500 text-center p-6">
        Failed to load reservations. Please try again.
      </div>
    );
  }

  if (!userrooms || userrooms.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        You don’t have any confirmed reservations yet.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {userrooms.map((room) => (
        <Card
          key={room.id}
          className="shadow-md hover:shadow-lg transition-shadow border border-border/40 flex flex-col justify-between"
        >
          <div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Reservation
                <Badge
                  variant={
                    room.status === "confirmed" ? "default" : "secondary"
                  }
                >
                  {room.status}
                </Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                {room.check_in} → {room.check_out}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <BedDouble className="w-4 h-4" />
                <span className="text-sm">
                  Room ID: {room.room_id.slice(0, 6)}...
                </span>
              </div>

              <div className="flex items-center gap-2 text-foreground font-medium">
                <span className=" text-green-600">ETB</span>
                <span>{room.total_price} Birr</span>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  className="capitalize"
                  variant={
                    room.payment_status === "paid" ? "success" : "outline"
                  }
                >
                  {room.payment_status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Booked on {new Date(room.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </div>

          {/* View Details Button */}
          <div className="p-4 pt-0">
            <Link to={`/reservations/${room.room_id}/${room.id}`}>
              <Button className="w-full">View Details</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
