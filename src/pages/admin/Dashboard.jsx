"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, BedDouble, CalendarCheck } from "lucide-react";

// Mock stats (replace with Supabase data later)
const stats = {
  totalRooms: 120,
  reservedRooms: 85,
  users: 230,
};

// Graph data example
const data = [
  { name: "Rooms", total: stats.totalRooms },
  { name: "Reserved", total: stats.reservedRooms },
  { name: "Users", total: stats.users },
];

export default function DashboardOverview() {
  return (
    <div className="p-6 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-bold">Hotel Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Rooms</CardTitle>
            <BedDouble className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRooms}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Reserved Rooms</CardTitle>
            <CalendarCheck className="w-6 h-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.reservedRooms}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Users Registered</CardTitle>
            <Users className="w-6 h-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.users}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graph */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Hotel Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
