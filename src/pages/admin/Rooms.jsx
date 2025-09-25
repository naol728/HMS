"use client";

import { getRooms } from "@/api/room";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import RoomForm from "@/components/dashboard/RoomForm";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function DashboardRooms() {
  const [open, setOpen] = useState(false);
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryFn: getRooms,
    queryKey: ["getRooms"],
  });

  if (isLoading) return <div>Loading rooms...</div>;
  if (error) return <div>Error loading rooms</div>;

  const statusColor = {
    available: "bg-green-500/15 text-green-600",
    reserved: "bg-yellow-500/15 text-yellow-600",
    occupied: "bg-red-500/15 text-red-600",
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          🏨 Rooms Dashboard
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="flex items-center gap-2 px-6">
              <PlusSquare className="w-5 h-5" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <RoomForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px]">Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price (ETB)</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rooms?.map((room, i) => (
              <TableRow
                key={room.id}
                className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}
              >
                <TableCell className="font-medium">
                  {room.room_number}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {room.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColor[room.status]} capitalize`}>
                    {room.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {room.price_per_night} ETB
                </TableCell>
                <TableCell>
                  {room.discount ? (
                    <Badge variant="secondary">{room.discount}%</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {room.description}
                </TableCell>
                <TableCell>
                  <img
                    src={room.image_url[0]}
                    alt={room.description}
                    className="w-16 h-12 object-cover rounded-md border"
                  />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(room.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(room.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
