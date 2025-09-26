import { getRooms } from "@/api/room";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function useRoom() {
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryFn: getRooms,
    queryKey: ["getRooms"],
  });
  return {
    data: rooms,
    isLoading,
    error,
  };
}
