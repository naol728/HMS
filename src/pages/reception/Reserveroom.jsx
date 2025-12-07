"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRooms } from "@/api/room";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, DollarSign, BedDouble } from "lucide-react";
import { createReservationAndReserveRoom } from "@/api/reservation";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function ReserveRoom() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(undefined);
  const [checkOut, setCheckOut] = useState(undefined);

  const userid = useSelector((state) => state.user.user.id);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: getRooms,
    queryKey: ["getRooms"],
  });

  const reservationMutation = useMutation({
    mutationFn: async (payload) =>
      await createReservationAndReserveRoom(payload),
    onSuccess: () => {
      toast.success("Room reserved successfully ✅");
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["getRooms"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to reserve room ❌");
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" />
        Loading rooms...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load rooms 😢
      </div>
    );

  const rooms = data || [];

  const handleReserveClick = (room) => {
    setSelectedRoom(room);
    setDialogOpen(true);
  };

  const handleConfirmReservation = () => {
    if (!selectedRoom || !checkIn || !checkOut) {
      return toast.error("Please select both check-in and check-out dates");
    }

    if (checkOut <= checkIn) {
      return toast.error("Check-out date must be after check-in date");
    }

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return toast.error("Invalid reservation period");
    }

    const totalPrice =
      nights * (selectedRoom.price_per_night - (selectedRoom.discount || 0));

    reservationMutation.mutate({
      room_id: selectedRoom.id,
      user_id: userid,
      check_in: checkIn.toISOString().split("T")[0],
      check_out: checkOut.toISOString().split("T")[0],
      total_price: totalPrice,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛏️ ክፍሎች</h1>

      {rooms.length === 0 ? (
        <p className="text-center text-muted-foreground">ምንም ክፍሎች አልተገኙም።</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <CardTitle>
                  ክፍሎ {room.room_number} — {room.type}
                </CardTitle>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {room.image_url?.[0] && (
                  <img
                    src={room.image_url[0]}
                    alt={room.type}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-yellow-500" />
                  <span>
                    ETB {room.price_per_night} / ለሊት{" "}
                    {room.discount ? `(-${room.discount})` : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BedDouble className="w-4 h-4 text-green-500" />
                  <span>ሁኔታ: {room.status}</span>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleReserveClick(room)}
                    disabled={
                      room.status === "occupied" || room.status === "reserved"
                    }
                  >
                    {room.status === "occupied" ? "Reserved" : "Reserve"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reservation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reserve Room {selectedRoom?.room_number}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Check-in */}
            <div>
              <label className="text-sm font-medium mb-1 block">ያረጋግጡ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full text-left">
                    {checkIn ? checkIn.toDateString() : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out */}
            <div>
              <label className="text-sm font-medium mb-1 block">ቼክ-አውት</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full text-left">
                    {checkOut ? checkOut.toDateString() : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {checkIn && checkOut && (
              <p className="text-sm text-muted-foreground">
                Total Price: ETB{" "}
                {Math.ceil(
                  (checkOut.getTime() - checkIn.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) *
                  (selectedRoom?.price_per_night -
                    (selectedRoom?.discount || 0))}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              ሰርዝ
            </Button>
            <Button
              onClick={handleConfirmReservation}
              disabled={reservationMutation.isLoading}
            >
              {reservationMutation.isLoading ? "ቦታ ማስያዝ..." : "አረጋግጥ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
