"use client";

import useRoom from "@/hooks/room/useRoom";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";

const ROOM_TYPES = ["all", "twin", "single", "triple", "deluxe", "standard"];
const ROOM_STATUSES = ["all", "available", "reserved", "occupied"];

export default function Rooms() {
  const { data: rooms, isLoading, error } = useRoom();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleShowDetail(id) {
    navigate(`/rooms/${id}`);
  }

  // Filter rooms
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return rooms.filter((room) => {
      const q = search.toLowerCase();

      const matchesSearch =
        room.room_number.toLowerCase().includes(q) ||
        room.type.toLowerCase().includes(q) ||
        room.status.toLowerCase().includes(q) ||
        room.description.toLowerCase().includes(q);

      const matchesType = type === "all" || room.type === type;
      const matchesStatus = status === "all" || room.status === status;

      const matchesPrice =
        (!minPrice || room.price_per_night >= Number(minPrice)) &&
        (!maxPrice || room.price_per_night <= Number(maxPrice));

      return matchesSearch && matchesType && matchesStatus && matchesPrice;
    });
  }, [rooms, search, type, status, minPrice, maxPrice]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20 text-primary">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading rooms...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        ❌ Error loading rooms. Please try again later.
      </div>
    );

  const statusColor = {
    available: "bg-green-500/15 text-green-600",
    reserved: "bg-yellow-500/15 text-yellow-600",
    occupied: "bg-red-500/15 text-red-600",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10" id="rooms">
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-extrabold tracking-tight">
          🏨 ክፍሎቻችንን ያስሱ
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          ለቆይታዎ የሚስማማውን ክፍል ያግኙ። በአይነት፣ በዋጋ ወይም በአቅርቦት ለማጣራት ማጣሪያዎችን ይጠቀሙ።
        </p>
      </div>

      {/* Search & Filters */}
      {/* Search & Filters */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">🔍 ፍጹም ክፍልዎን ያግኙ</h3>
        <p className="text-sm text-muted-foreground">
          ክፍሎችን በቁጥር፣ በአይነት፣ በሁኔታ ወይም በዋጋ ክልል በፍጥነት ለማጥበብ ከታች ያለውን የፍለጋ ሳጥን እና
          ማጣሪያዎችን ይጠቀሙ።
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end bg-muted/30 p-4 rounded-xl shadow-sm">
          {/* Search */}
          <div className="relative">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              ፈልግ
            </label>
            <Search className="absolute left-3 top-9 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              type="text"
              placeholder="Search by room number, type, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              የክፍል አይነት
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a type" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              ተገኝነት
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              የዋጋ ክልል (ETB)
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          ከማጣሪያዎችዎ ጋር የሚዛመዱ ምንም ክፍሎች አልተገኙም።
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => {
            const discountedPrice =
              room.discount > 0
                ? room.price_per_night -
                  (room.price_per_night * room.discount) / 100
                : room.price_per_night;

            return (
              <Card
                key={room.id}
                className="overflow-hidden border shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-xl cursor-pointer group"
              >
                {/* Image with overlay */}
                <div className="relative">
                  <img
                    src={room.image_url[0]}
                    alt={room.description}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <Badge
                    className={`absolute top-3 left-3 px-3 py-1 text-sm rounded-full shadow-sm ${
                      statusColor[room.status]
                    }`}
                  >
                    {room.status}
                  </Badge>
                </div>

                {/* Content */}
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-xl">
                    Room {room.room_number}
                    <Badge variant="secondary" className="capitalize">
                      {room.type}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-300">
                    {room.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      {discountedPrice} ETB
                    </p>
                    {room.discount > 0 && (
                      <p className="text-sm text-muted-foreground line-through">
                        {room.price_per_night} ETB
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleShowDetail(room.id)}
                    className="transition-transform hover:scale-105"
                  >
                    ዝርዝሮችን ይመልከቱ
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
