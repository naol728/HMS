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
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const { data: rooms, isLoading, error } = useRoom();
  const navigate = useNavigate();

  function handleShowdetail(id) {
    navigate(`/rooms/${id}`);
  }

  if (isLoading)
    return <div className="text-center py-10">Loading rooms...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">Error loading rooms</div>
    );

  const statusColor = {
    available: "bg-green-500/15 text-green-600",
    reserved: "bg-yellow-500/15 text-yellow-600",
    occupied: "bg-red-500/15 text-red-600",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-10 text-center">
        🏨 Explore Our Rooms
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rooms?.map((room) => (
          <Card
            key={room.id}
            onClick={() => handleShowdetail(room.id)} // ✅ whole card is clickable
            className="overflow-hidden border shadow-md hover:shadow-xl transition-all duration-300 rounded-xl cursor-pointer group"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={room.image_url[0]}
                alt={room.description}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge
                className={`absolute top-3 left-3 px-3 py-1 text-sm rounded-full ${
                  statusColor[room.status]
                }`}
              >
                {room.status}
              </Badge>
            </div>

            {/* Content */}
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-xl">
                Room {room.room_number}
                <Badge variant="secondary" className="capitalize">
                  {room.type}
                </Badge>
              </CardTitle>
              <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-300">
                {room.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-lg font-semibold text-primary">
                {room.price_per_night} ETB{" "}
                {room.discount > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({room.discount}% off)
                  </span>
                )}
              </p>
            </CardContent>

            {/* Footer */}
            <CardFooter>
              <Button className="w-full">Reserve</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
