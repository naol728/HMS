"use client";

import React, { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReservationAndReserveRoom } from "@/api/reservation";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function ReserveRoom({ room }) {
  const userId = useSelector((state) => state.user.user.id);
  const queryClient = useQueryClient();
  const [checkIn, setCheckIn] = useState(undefined);
  const [checkOut, setCheckOut] = useState(undefined);

  const { mutate, isLoading } = useMutation({
    mutationFn: createReservationAndReserveRoom,
    mutationKey: ["createReservationAndReserveRoom"],
    onSuccess: () => {
      toast.success("Room Reserved Successfully");
      queryClient.invalidateQueries({ queryKey: ["getRoomById", room.id] });
    },
    onError: (err) => {
      toast.error(err.message || "Something Went Wrong");
    },
  });

  const handleSubmit = () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (checkOut <= checkIn) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    const pricePerNight =
      room.price_per_night - room.price_per_night / room.discount;
    const total_price = nights * pricePerNight;

    mutate({
      user_id: userId,
      room_id: room.id,
      check_in: checkIn.toISOString().split("T")[0],
      check_out: checkOut.toISOString().split("T")[0],
      total_price,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Reserve Room</DialogTitle>
        <DialogDescription>
          Select your stay dates and confirm reservation
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {/* Check-in Date */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="checkin">Check-in</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
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

        {/* Check-out Date */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="checkout">Check-out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
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

        {/* Total Price */}
        {checkIn && checkOut && (
          <div className="grid w-full items-center gap-1.5">
            <Label>Total Price</Label>
            <Input
              value={`ETB${
                Math.ceil(
                  (checkOut.getTime() - checkIn.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) *
                  room.price_per_night -
                room.price_per_night / room.discount
              }`}
              readOnly
            />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Reserving..." : "Reserve Room"}
        </Button>
      </DialogFooter>
    </>
  );
}
