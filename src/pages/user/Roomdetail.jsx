"use client";

import { useParams } from "react-router-dom";
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
import { Link } from "react-router-dom";

export default function Roomdetail() {
  const { id } = useParams();

  const {
    data: room,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getRoomById", id],
    queryFn: () => getRoomByID(id),
  });

  if (isLoading) return <div>Loading room details...</div>;
  if (error) return <div>Error loading room details</div>;
  if (!room) return <div>No room found</div>;

  const statusColor = {
    available: "bg-green-500/15 text-green-600",
    reserved: "bg-yellow-500/15 text-yellow-600",
    occupied: "bg-red-500/15 text-red-600",
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Image Gallery */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <img
          src={room.image_url[0]}
          alt={room.description}
          className="w-full h-80 object-cover rounded-lg shadow-md"
        />
        <div className="grid grid-cols-2 gap-2">
          {room.image_url.slice(1).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`room-${idx}`}
              className="w-full h-40 object-cover rounded-md"
            />
          ))}
        </div>
      </div>

      {/* Room Details */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Room {room.room_number}
            </CardTitle>
            <Badge className={`capitalize ${statusColor[room.status]}`}>
              {room.status}
            </Badge>
          </div>
          <CardDescription className="text-lg capitalize">
            {room.type}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>{room.description}</p>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <span className="font-semibold">Price per Night:</span>{" "}
              {room.price_per_night} ETB
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

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline">
              {" "}
              <Link to="/rooms"> Back to Rooms</Link>
            </Button>
            <Button>Reserve Now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
