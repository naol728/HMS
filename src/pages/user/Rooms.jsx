"use client";

import useRoom from "@/hooks/room/useRoom";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Rooms() {
  const { data: rooms, isLoading, error } = useRoom();

  if (isLoading) return <div>Loading rooms...</div>;
  if (error) return <div>Error loading rooms</div>;

  const statusColor = {
    available: "bg-green-500/15 text-green-600",
    reserved: "bg-yellow-500/15 text-yellow-600",
    occupied: "bg-red-500/15 text-red-600",
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🏨 Rooms</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms?.map((room) => (
          <Card
            key={room.id}
            className="overflow-hidden border shadow-sm hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={room.image_url[0]}
                alt={room.description}
                className="w-full h-48 object-cover"
              />
              <Badge
                className={`absolute top-2 left-2 ${statusColor[room.status]}`}
              >
                {room.status}
              </Badge>
            </div>

            {/* Content */}
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Room {room.room_number}
                <Badge variant="outline" className="capitalize">
                  {room.type}
                </Badge>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {room.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-lg font-semibold">
                {room.price_per_night} ETB{" "}
                {room.discount > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({room.discount}% off)
                  </span>
                )}
              </p>
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Details</Button>
              <Button>Reserve</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
