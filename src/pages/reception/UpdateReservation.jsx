"use client";

import { getAllReservation } from "@/api/reservation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { deletereservation } from "@/api/reservation";

export default function UpdateReservation() {
  const queryClient = useQueryClient();

  const {
    data: reservations,
    isLoading,
    error,
  } = useQuery({
    queryFn: getAllReservation,
    queryKey: ["getAllReservation"],
  });

  const { mutate: deleteReservation, isPending } = useMutation({
    mutationFn: deletereservation,
    onSuccess: () => {
      toast.success("Reservation status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["getAllReservation"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update reservation status");
    },
  });

  if (isLoading) return <div className="text-center py-6">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">Error loading reservations</div>
    );
  if (!reservations?.length)
    return <div className="text-center py-6">No reservations found.</div>;

  const statusColors = {
    confirmed: "bg-green-500/15 text-green-600",
    pending: "bg-yellow-500/15 text-yellow-600",
    cancelled: "bg-red-500/15 text-red-600",
  };

  return (
    <Card className="p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">📋 ቦታ ማስያዣዎችን ያቀናብሩ</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ክፍል</TableHead>
            <TableHead>እንግዳ</TableHead>
            <TableHead>ያረጋግጡ</TableHead>
            <TableHead>ቼክ-አውት</TableHead>
            <TableHead>ጠቅላላ ዋጋ (ETB)</TableHead>
            <TableHead>ክፍያ</TableHead>
            <TableHead>ሁኔታ</TableHead>
            <TableHead>ሰርዝ</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reservations.map((res) => (
            <TableRow
              key={res.id}
              className="hover:bg-muted/50 transition-colors"
            >
              {/* Room Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={res.rooms?.image_url?.[0]}
                    alt={res.rooms?.type}
                    className="w-14 h-12 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">
                      Room {res.rooms?.room_number}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {res.rooms?.type}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* User Info */}
              <TableCell>
                <p className="font-semibold">{res.users?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {res.users?.email}
                </p>
              </TableCell>

              <TableCell>{res.check_in}</TableCell>
              <TableCell>{res.check_out}</TableCell>
              <TableCell>{res.total_price}</TableCell>

              {/* Payment Status */}
              <TableCell>
                <Badge
                  className={
                    res.payment_status === "paid"
                      ? "bg-green-500/15 text-green-600"
                      : "bg-yellow-500/15 text-yellow-600"
                  }
                >
                  {res.payment_status}
                </Badge>
              </TableCell>

              {/* Reservation Status */}
              <TableCell>
                <Badge className={`${statusColors[res.status]} capitalize`}>
                  {res.status}
                </Badge>
              </TableCell>

              {/* Update Button */}
              <TableCell>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending || res.payment_status === "paid"}
                  onClick={() => deleteReservation(res.id)}
                >
                  ሰርዝ
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
