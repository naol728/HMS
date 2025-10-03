import React, { useState } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { giveFeedback } from "@/api/feedback";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function FeedBackForm({ reservationid, onClose }) {
  const userid = useSelector((state) => state.user.user.id);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const queryclient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: giveFeedback,
    mutationKey: ["giveFeedback"],
    onSuccess: () => {
      toast.success("Feedback sent successfully 🎉");
      queryclient.invalidateQueries({ queryKey: ["getfeedbacks"] });
      if (onClose) onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error("Please fill in all fields.");
      return;
    }

    mutate({
      rating: Number(rating),
      reservationid,
      userid,
      comment,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Leave Your Feedback</DialogTitle>
        <DialogDescription>
          We value your opinion. Please rate your stay and leave a comment.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* Rating Input */}
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1 - 5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Enter a rating from 1 to 5"
            required
          />
        </div>

        {/* Comment Input */}
        <div className="space-y-2">
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Feedback"}
        </Button>
      </DialogFooter>
    </form>
  );
}
