/* eslint-disable*/
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getUserReservation } from "@/api/reservation";
import { Loader2, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { makePayment } from "@/api/payment";
import { useState } from "react";
import { toast } from "sonner";

export default function PayReservation() {
  const userid = useSelector((state) => state.user.user.id);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [amount, setAmount] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["getUserReservation", userid],
    queryFn: () => getUserReservation(userid),
  });

  const { mutate, isLoading: isPending } = useMutation({
    mutationFn: makePayment,
    onSuccess: () => {
      toast.success("Paid successfully!");
      queryClient.invalidateQueries({ queryKey: ["getUserReservation"] });
      setSelectedReservation(null); // Close dialog
      setAmount(""); // Reset amount
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong!");
    },
  });

  const handlePayment = (resid) => {
    mutate({ resid, amount });
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Pending
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="default" className="text-green-600">
            Paid
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "reserved":
        return <Badge variant="secondary">Reserved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading reservations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load reservations 😢
      </div>
    );
  }

  const reservations = data || [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
        <h1 className="text-3xl font-bold">💳 My Reservations</h1>
      </div>

      {reservations.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No reservations found.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Make Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((res) => (
              <TableRow key={res.id}>
                <TableCell>{res.rooms?.room_number || res.room_id}</TableCell>
                <TableCell>
                  {res.rooms?.image_url?.[0] && (
                    <img
                      className="w-14 h-14 rounded-md object-cover"
                      src={res.rooms.image_url[0]}
                      alt={res.rooms.room_number}
                    />
                  )}
                </TableCell>
                <TableCell>{res.rooms?.type || "-"}</TableCell>
                <TableCell>{res.check_in}</TableCell>
                <TableCell>{res.check_out}</TableCell>
                <TableCell>ETB {res.total_price}</TableCell>
                <TableCell>{getStatusBadge(res.status)}</TableCell>
                <TableCell>{getStatusBadge(res.payment_status)}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        disabled={res.payment_status.toLowerCase() === "paid"}
                        onClick={() => setSelectedReservation(res.id)}
                      >
                        Pay
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Confirm Payment</DialogTitle>
                        <DialogDescription className="space-y-4">
                          <p>
                            Enter amount to pay for Room{" "}
                            {res.rooms?.room_number || res.room_id}:
                          </p>
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                              onClick={() => handlePayment(res.id)}
                              disabled={isPending || !amount}
                            >
                              {isPending ? "Processing..." : "Pay"}
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
