"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllfeedbacks } from "@/api/feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Star, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function DashboardComments() {
  const { data, error, isLoading } = useQuery({
    queryFn: getAllfeedbacks,
    queryKey: ["getAllfeedbacks"],
  });

  const [search, setSearch] = useState("");

  const feedbacks = data || [];

  // Filter by room number or type
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const roomType = fb.room?.type?.toLowerCase() || "";
      const roomNum = fb.room?.room_number?.toLowerCase() || "";
      return (
        roomType.includes(search.toLowerCase()) ||
        roomNum.includes(search.toLowerCase())
      );
    });
  }, [feedbacks, search]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading feedbacks...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load feedbacks 😢
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Customer Feedbacks
        </h1>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by room number or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <p className="text-center text-muted-foreground mt-20">
          No feedbacks found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedbacks.map((fb) => (
            <Card
              key={fb.id}
              className="shadow-md border hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="space-y-1">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    Room {fb.room.room_number} — {fb.room.type}
                  </CardTitle>
                  <Badge
                    variant={
                      fb.reservation.payment_status === "paid"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {fb.reservation.payment_status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(fb.created_at).toLocaleString()}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Room Info */}
                <div className="flex items-start gap-3">
                  {fb.room.image_url?.length > 0 && (
                    <img
                      src={fb.room.image_url[0]}
                      alt={fb.room.type}
                      className="w-24 h-20 object-cover rounded-md border"
                    />
                  )}
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-semibold">Type:</span>{" "}
                      {fb.room.type}
                    </p>
                    <p>
                      <span className="font-semibold">Price:</span> ETB{" "}
                      {fb.room.price_per_night}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {fb.room.status}
                    </p>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <p className="text-base font-medium leading-snug">
                    “{fb.comment}”
                  </p>
                  <div className="flex mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < fb.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Reservation Info */}
                <div className="border-t pt-3 text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-semibold">Check-in:</span>{" "}
                    {fb.reservation.check_in}
                  </p>
                  <p>
                    <span className="font-semibold">Check-out:</span>{" "}
                    {fb.reservation.check_out}
                  </p>
                  <p>
                    <span className="font-semibold">Total:</span> ETB{" "}
                    {fb.reservation.total_price}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {fb.reservation.status}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
