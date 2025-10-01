"use client";

import React, { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRoom } from "@/api/room";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const ROOM_TYPES = ["twin", "single", "triple", "deluxe", "standard"];
const ROOM_STATUSES = ["available", "reserved", "occupied"];

const schema = z.object({
  room_number: z.string().min(1, "Room number is required"),
  type: z.enum(ROOM_TYPES),
  status: z.enum(ROOM_STATUSES),
  price_per_night: z
    .string()
    .refine((val) => !isNaN(val) && Number(val) > 0, "Price must be a number"),
  discount: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(val) && Number(val) >= 0 && Number(val) <= 100),
      "Discount must be between 0 and 100"
    ),
  description: z.string().min(5, "Description is too short"),
});

export default function RoomForm({ setOpen }) {
  const queryclient = useQueryClient();
  const [images, setImages] = useState([]);

  const { register, handleSubmit, setValue, formState, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      room_number: "",
      type: undefined,
      status: undefined,
      price_per_night: "",
      discount: "",
      description: "",
    },
  });

  const { errors } = formState;

  const { mutate, isPending } = useMutation({
    mutationFn: createRoom,
    mutationKey: ["createRoom"],
    onSuccess: () => {
      toast.success("Room Added Successfully");
      queryclient.invalidateQueries({ queryKey: ["getRooms"] });
      reset();
      setImages([]);

      // ✅ Close dialog
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || "Error Creating Room ");
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    if (images.length < 1) {
      toast.error("At least 1 image is required");
      return;
    }

    const formData = new FormData();

    // append text inputs
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // append images
    images.forEach((img) => {
      formData.append("images", img);
    });

    // ✅ Debug log
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // send to mutation
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Add New Room</DialogTitle>
        <DialogDescription>
          Fill in the details below to add a new room.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Room Number */}
        <div>
          <Label htmlFor="room_number">Room Number</Label>
          <Input id="room_number" {...register("room_number")} />
          {errors.room_number && (
            <p className="text-red-500 text-sm">{errors.room_number.message}</p>
          )}
        </div>

        {/* Room Type */}
        <div>
          <Label htmlFor="type">Room Type</Label>
          <Select onValueChange={(val) => setValue("type", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        {/* Room Status */}
        <div>
          <Label htmlFor="status">Room Status</Label>
          <Select onValueChange={(val) => setValue("status", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>

        {/* Price per Night */}
        <div>
          <Label htmlFor="price_per_night">Price per Night (ETB)</Label>
          <Input
            id="price_per_night"
            type="number"
            {...register("price_per_night")}
          />
          {errors.price_per_night && (
            <p className="text-red-500 text-sm">
              {errors.price_per_night.message}
            </p>
          )}
        </div>

        {/* Discount */}
        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input id="discount" type="number" {...register("discount")} />
          {errors.discount && (
            <p className="text-red-500 text-sm">{errors.discount.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...register("description")} />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Multi Image Upload */}
      <div>
        <Label htmlFor="images">Upload Room Images (max 5)</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        {images.length > 0 && (
          <ScrollArea className="h-32 mt-2 border rounded-md p-2">
            <div className="flex gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Room"}
        </Button>
      </div>
    </form>
  );
}
