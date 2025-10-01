/* eslint-disable */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getUserReservation } from "@/api/reservation";
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

export default function UserRooms() {
  const userid = useSelector((state) => state.user.user.id);
  const email = useSelector((state) => state.user.user.email);

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: () => getUserReservation(userid),
    queryKey: ["getUserReservation", userid],
  });

  // Handle payment
  async function handlePayNow(reservation) {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payment/checkout",
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
      console.log(data);
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

  if (isLoading) return <div>Loading reservations...</div>;
  if (error) return <div>Error loading reservations</div>;
  if (!data || data.length === 0) return <div>No reservations found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Reservations</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead> Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((res) => (
            <TableRow key={res.id}>
              <TableCell>{res.check_in}</TableCell>
              <TableCell>{res.check_out}</TableCell>
              <TableCell>${res.total_price}</TableCell>
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
              <TableCell>
                {res.payment_status === "pending" ? (
                  <Button size="sm" onClick={() => handlePayNow(res)}>
                    Pay Now
                  </Button>
                ) : (
                  <>Payed</>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
