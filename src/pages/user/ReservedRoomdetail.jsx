import { getReservationbyid } from "@/api/reservation";
import { getRoomByID } from "@/api/room";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CalendarDays,
  BedDouble,
  DollarSign,
  Percent,
  ArrowLeft,
} from "lucide-react";

export default function ReservedRoomdetail() {
  const { roomid, reservationid } = useParams();
  const navigate = useNavigate();

  const {
    data: room,
    isLoading: roomloading,
    error: roomerror,
  } = useQuery({
    queryKey: ["getRoomById", roomid],
    queryFn: () => getRoomByID(roomid),
  });

  const {
    data: reservation,
    isLoading: reservationloading,
    error: reservationerror,
  } = useQuery({
    queryKey: ["getReservationbyid", reservationid],
    queryFn: () => getReservationbyid(reservationid),
  });

  if (roomloading || reservationloading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Loading reservation details...
        </span>
      </div>
    );
  }

  if (roomerror || reservationerror) {
    return (
      <div className="text-red-500 text-center p-6">
        Failed to load reservation details. Please try again.
      </div>
    );
  }

  if (!room || !reservation) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        Reservation or Room not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-lg border border-border/40">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Room {room.room_number}
            <Badge variant="default" className="capitalize">
              {room.type}
            </Badge>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Reserved from{" "}
            <span className="font-medium text-foreground">
              {reservation.check_in}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {reservation.check_out}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Room Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {room.image_url?.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Room ${idx}`}
                className="rounded-lg object-cover h-52 w-full shadow-sm hover:scale-105 transition-transform"
              />
            ))}
          </div>

          {/* Room Info */}
          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              {room.description}
            </p>

            <div className="flex items-center gap-2 text-foreground font-medium">
              <span className=" text-green-600">ETB</span>
              <span>{room.price_per_night} Birr / night</span>
            </div>

            {room.discount > 0 && (
              <div className="flex items-center gap-2 text-amber-700 font-medium">
                <Percent className="w-4 h-4" />
                <span>{room.discount}% Discount</span>
              </div>
            )}
          </div>

          {/* Reservation Dates */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            Check-in:{" "}
            <span className="text-foreground font-medium">
              {reservation.check_in}
            </span>{" "}
            | Check-out:{" "}
            <span className="text-foreground font-medium">
              {reservation.check_out}
            </span>
          </div>

          {/* Feedback Button */}
          <div className="pt-4">
            <Button className="w-full">Give Feedback</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
