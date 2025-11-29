/* eslint-disable */
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { deletereservation, getUserReservation } from "@/api/reservation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UserReservation() {
  const userid = useSelector((state) => state.user.user.id);
  const email = useSelector((state) => state.user.user.email);

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: () => getUserReservation(userid),
    queryKey: ["getUserReservation", userid],
  });
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: deletereservation,
    mutationKey: ["deletereservation"],
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: "getUserReservation" });
      toast.success("sucessfully deleted reservation");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // Handle payment
  async function handlePayNow(reservation) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKENDURL}/payment/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reservation_id: reservation.id,
            amount: reservation.total_price,
            email,
            first_name: reservation.user_first_name || "First",
            last_name: reservation.user_last_name || "Last",
          }),
        }
      );

      const res = await response.json();
      const data = res.data;
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Failed to create payment session.");
        console.error(data);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong during payment.");
    }
  }

  // Refetch reservations after returning from payment success page
  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("payment") === "success") {
      refetch();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refetch]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin w-6 h-6 text-primary" />
        <span className="ml-2 text-muted-foreground">
          Loading reservations...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600">
        ❌ Error loading reservations
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="text-center text-muted-foreground">
        No reservations found
      </div>
    );

  return (
    <div className="p-6">
      <Card className="shadow-lg border">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-primary">
            My Reservations
          </CardTitle>
          <CardDescription>
            Track your booking details and complete pending payments.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Check-in</TableHead>
                <TableHead className="font-semibold">Check-out</TableHead>
                <TableHead className="font-semibold">Total Price</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold text-right">
                  Action
                </TableHead>
                <TableHead className="font-semibold">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((res) => (
                <TableRow key={res.id} className="hover:bg-muted/50">
                  <TableCell>{res.check_in}</TableCell>
                  <TableCell>{res.check_out}</TableCell>
                  <TableCell className="font-medium">
                    ETB {res.total_price}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        res.status === "confirmed"
                          ? "default"
                          : res.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {res.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        res.payment_status === "paid"
                          ? "default"
                          : res.payment_status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {res.payment_status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    {res.payment_status === "pending" ? (
                      <Button
                        size="sm"
                        className="bg-primary text-white hover:bg-primary/90"
                        onClick={() => handlePayNow(res)}
                      >
                        Pay Now
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">✅ Paid</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => mutate(res.id)}
                      disabled={isPending}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
