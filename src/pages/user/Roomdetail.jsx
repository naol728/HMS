"use client";

import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoomByID } from "@/api/room";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ReserveRoom from "@/components/user/ReserveRoom";

export default function RoomDetail() {
  const { id } = useParams();

  const {
    data: room,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getRoomById", id],
    queryFn: () => getRoomByID(id),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20 text-primary">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading room details...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        ❌ Error loading room details. Please try again later.
      </div>
    );

  if (!room)
    return (
      <div className="text-center py-10 text-muted-foreground">
        No room found.
      </div>
    );

  const statusColor = {
    available: "bg-green-500/15 text-green-600",
    reserved: "bg-yellow-500/15 text-yellow-600",
    occupied: "bg-red-500/15 text-red-600",
  };

  const discountedPrice =
    room.discount > 0
      ? room.price_per_night - (room.price_per_night * room.discount) / 100
      : room.price_per_night;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Image Gallery */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <img
            src={room.image_url[0]}
            alt={room.description}
            className="w-full h-96 object-cover rounded-xl shadow-md"
          />
          <Badge
            className={`absolute top-4 left-4 px-3 py-1 text-sm rounded-full ${
              statusColor[room.status]
            }`}
          >
            {room.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {room.image_url.slice(1).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`room-${idx}`}
              className="w-full h-44 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </div>

      {/* Room Details */}
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle className="text-3xl font-bold">
                Room {room.room_number}
              </CardTitle>
              <CardDescription className="text-lg capitalize">
                {room.type}
              </CardDescription>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {discountedPrice} ETB / night
              </p>
              {room.discount > 0 && (
                <p className="text-sm text-muted-foreground line-through">
                  {room.price_per_night} ETB
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            {room.description}
          </p>

          <Separator />

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-4 text-base">
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className="capitalize">{room.status}</span>
            </div>
            <div>
              <span className="font-semibold">Discount:</span>{" "}
              {room.discount ? `${room.discount}%` : "No discount"}
            </div>
            <div>
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(room.created_at).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Updated At:</span>{" "}
              {new Date(room.updated_at).toLocaleString()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" asChild>
              <Link to="/rooms">Back to Rooms</Link>
            </Button>

            <Dialog>
              <DialogTrigger
                disabled={room.status !== "available"}
                className="transition-transform hover:scale-105"
              >
                <Button disabled={room.status !== "available"}>
                  Reserve Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ReserveRoom room={room} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
