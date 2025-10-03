import { getReservationbyid } from "@/api/reservation";
import { getRoomByID } from "@/api/room";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, Percent, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import FeedBackForm from "@/components/user/FeedBackForm";
import { useSelector } from "react-redux";
import { getfeedbacks } from "@/api/feedback";

export default function ReservedRoomdetail() {
  const { roomid, reservationid } = useParams();
  const navigate = useNavigate();
  const userid = useSelector((state) => state.user.user.id);

  const [open, setOpen] = useState(false);

  const {
    data: room,
    isLoading: roomloading,
    error: roomerror,
  } = useQuery({
    queryKey: ["getRoomById", roomid],
    queryFn: () => getRoomByID(roomid),
  });

  const {
    data: reservation,
    isLoading: reservationloading,
    error: reservationerror,
  } = useQuery({
    queryKey: ["getReservationbyid", reservationid],
    queryFn: () => getReservationbyid(reservationid),
  });

  const {
    data: feedback,
    isLoading: feedbackloading,
    error: feedbackerror,
  } = useQuery({
    queryFn: () => getfeedbacks(reservationid, userid),
    queryKey: ["getfeedbacks", reservationid, userid],
    enabled: !!reservationid && !!userid,
  });
  if (roomloading || reservationloading || feedbackloading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          Loading reservation details...
        </span>
      </div>
    );
  }

  if (roomerror || reservationerror || feedbackerror) {
    return (
      <div className="text-red-500 text-center p-6">
        Failed to load reservation details. Please try again.
      </div>
    );
  }

  if (!room || !reservation) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        Reservation or Room not found.
      </div>
    );
  }

  // Ensure feedback is null if API returns nothing
  const hasFeedback = feedback && feedback.length > 0;
  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-lg border border-border/40">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Room {room.room_number}
            <Badge variant="default" className="capitalize">
              {room.type}
            </Badge>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Reserved from{" "}
            <span className="font-medium text-foreground">
              {reservation.check_in}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {reservation.check_out}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Room Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {room.image_url?.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Room ${idx}`}
                className="rounded-lg object-cover h-52 w-full shadow-sm hover:scale-105 transition-transform"
              />
            ))}
          </div>

          {/* Room Info */}
          <div className="space-y-3">
            <p className="text-muted-foreground leading-relaxed">
              {room.description}
            </p>

            <div className="flex items-center gap-2 text-foreground font-medium">
              <span className=" text-green-600">ETB</span>
              <span>{room.price_per_night} Birr / night</span>
            </div>

            {room.discount > 0 && (
              <div className="flex items-center gap-2 text-amber-700 font-medium">
                <Percent className="w-4 h-4" />
                <span>{room.discount}% Discount</span>
              </div>
            )}
          </div>

          {/* Reservation Dates */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            Check-in:{" "}
            <span className="text-foreground font-medium">
              {reservation.check_in}
            </span>{" "}
            | Check-out:{" "}
            <span className="text-foreground font-medium">
              {reservation.check_out}
            </span>
          </div>

          {/* Feedback Section */}
          {hasFeedback ? (
            <div className="mt-4 border rounded-md p-4 bg-muted/40 space-y-2">
              <h3 className="font-semibold text-lg">Your Feedback</h3>

              {feedback.map((fb) => (
                <div
                  key={fb.id}
                  className="space-y-2 border-b last:border-0 pb-2"
                >
                  <p>
                    <span className="font-medium">Rating:</span>{" "}
                    <span className="text-yellow-600">{fb.rating} / 5</span>
                  </p>
                  <p>
                    <span className="font-medium">Comment:</span>{" "}
                    <span className="text-foreground">
                      {fb.comment === "no" ? "No comment provided" : fb.comment}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted on {new Date(fb.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="pt-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Give Feedback</Button>
                </DialogTrigger>
                <DialogContent>
                  <FeedBackForm
                    roomid={roomid}
                    reservationid={reservationid}
                    onClose={() => setOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
