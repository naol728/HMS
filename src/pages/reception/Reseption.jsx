"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllReservation } from "@/api/reservation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  User,
  BedDouble,
  CalendarDays,
  DollarSign,
  Search,
} from "lucide-react";

export default function Reseption() {
  const { data, error, isLoading } = useQuery({
    queryFn: getAllReservation,
    queryKey: ["getallReservation"],
  });

  const [search, setSearch] = useState("");

  const reservations = useMemo(() => data || [], [data]);

  const filteredReservations = useMemo(() => {
    const term = search.toLowerCase();
    return reservations.filter((res) => {
      const name = res.users?.name?.toLowerCase() || "";
      const email = res.users?.email?.toLowerCase() || "";
      const roomNumber = res.rooms?.room_number?.toLowerCase() || "";
      return (
        name.includes(term) || email.includes(term) || roomNumber.includes(term)
      );
    });
  }, [reservations, search]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <Loader2 className="animate-spin mr-2" />
        Loading reservations...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load reservations 😢
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">🏨 የአሁኑ ቦታ ማስያዣዎች</h1>

        {/* 🔍 Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or room #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <p className="text-center text-muted-foreground">
          ምንም ቦታ ማስያዣዎች አልተገኙም።
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReservations.map((res) => (
            <Card
              key={res.id}
              className="shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    ክፍል {res.rooms?.room_number || "N/A"} —{" "}
                    {res.rooms?.type || "Unknown"}
                  </CardTitle>

                  <Badge
                    variant={
                      res.payment_status === "paid" ? "default" : "secondary"
                    }
                  >
                    {res.payment_status}
                  </Badge>
                </div>

                <CardDescription className="text-sm text-muted-foreground">
                  የተያዘው በ {res.users?.name || "Guest"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Room Image */}
                {res.rooms?.image_url?.length > 0 && (
                  <img
                    src={res.rooms.image_url[0]}
                    alt={res.rooms.type}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}

                {/* Reservation Details */}
                <div className="text-sm space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>{res.users?.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span>
                      {res.check_in} → {res.check_out}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-500" />
                    <span>Total: ETB {res.total_price}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-green-500" />
                    <span>Room Status: {res.rooms?.status}</span>
                  </p>
                </div>

                {/* Reservation Status */}
                <div className="pt-2 border-t">
                  <Badge
                    variant={
                      res.status === "confirmed" ? "default" : "secondary"
                    }
                  >
                    {res.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
