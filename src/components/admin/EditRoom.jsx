"use client";

import React, { useState } from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom } from "@/api/room";
import { toast } from "sonner";

const ROOM_TYPES = ["twin", "single", "triple", "deluxe", "standard"];
const ROOM_STATUSES = ["available", "reserved", "occupied"];

export default function EditRoom({ room }) {
  const [formState, setFormState] = useState({
    room_number: room.room_number || "",
    type: room.type || "",
    status: room.status || "",
    price_per_night: room.price_per_night || "",
    discount: room.discount || 0,
    description: room.description || "",
  });
  const queryclinet = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateRoom,
    mutationKey: ["updateRoom"],
    onSuccess: () => {
      toast.success("Room Updated Sucessfully");
      queryclinet.invalidateQueries({ queryKey: ["getRooms"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("room_number", formState.room_number);
    formData.append("type", formState.type);
    formData.append("status", formState.status);
    formData.append("price_per_night", formState.price_per_night);
    formData.append("discount", formState.discount);
    formData.append("description", formState.description);

    // if you add an image input:
    // for (const file of selectedFiles) {
    //   formData.append("images", file);
    // }

    mutate({ id: room.id, formData });
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>ክፍልን አርትዕ</SheetTitle>
        <SheetDescription>
          በክፍሉ ዝርዝሮች ላይ ለውጦችን ያድርጉ። ሲጨርሱ አስቀምጥን ጠቅ ያድርጉ።
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4 py-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="room_number">የክፍል ቁጥር</Label>
          <Input
            id="room_number"
            name="room_number"
            value={formState.room_number}
            onChange={handleChange}
            disable={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="type">አይነት</Label>
          <Select
            value={formState.type}
            onValueChange={(val) =>
              setFormState((prev) => ({ ...prev, type: val }))
            }
            disable={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">ሁኔታ</Label>
          <Select
            value={formState.status}
            onValueChange={(val) =>
              setFormState((prev) => ({ ...prev, status: val }))
            }
            disable={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {ROOM_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price_per_night">የአንድ ሌሊት ዋጋ</Label>
          <Input
            id="price_per_night"
            type="number"
            name="price_per_night"
            value={formState.price_per_night}
            onChange={handleChange}
            disable={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="discount">ቅናሽ (%)</Label>
          <Input
            id="discount"
            type="number"
            name="discount"
            value={formState.discount}
            onChange={handleChange}
            disable={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">መግለጫ</Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            value={formState.description}
            onChange={handleChange}
            disable={isPending}
          />
        </div>
      </div>

      <SheetFooter>
        <Button type="submit" disable={isPending}>
          ውጦችን አስቀምጥ
        </Button>
        <SheetClose asChild>
          <Button variant="outline">ገጠመ</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  );
}
