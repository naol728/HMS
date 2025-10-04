"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/api/room";
import { getallUsers } from "@/api/users";
import { getPaymentdata } from "@/api/payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  LabelList,
} from "recharts";
import {
  Users,
  BedDouble,
  CalendarCheck,
  DollarSign,
  Loader2,
} from "lucide-react";

export default function DashboardOverview() {
  const {
    data: rooms,
    error: roomsError,
    isLoading: roomsLoading,
  } = useQuery({
    queryFn: getRooms,
    queryKey: ["getRooms"],
  });

  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useQuery({
    queryFn: getallUsers,
    queryKey: ["getallUsers"],
  });

  const {
    data: payments,
    error: paymentError,
    isLoading: paymentLoading,
  } = useQuery({
    queryFn: getPaymentdata,
    queryKey: ["getPaymentdata"],
  });

  const isError = roomsError || usersError || paymentError;
  const isLoading = roomsLoading || usersLoading || paymentLoading;

  // --- Compute Statistics ---
  const totalRooms = rooms?.length || 0;
  const reservedRooms =
    rooms?.filter((room) => room.status === "occupied").length || 0;
  const totalUsers = users?.length || 0;
  const totalRevenue =
    payments?.reduce(
      (acc, p) => acc + (p.status === "paid" ? p.amount : 0),
      0
    ) || 0;

  // --- Chart Data (overview) ---
  const overviewData = [
    { name: "Rooms", value: totalRooms },
    { name: "Reserved", value: reservedRooms },
    { name: "Users", value: totalUsers },
    { name: "Revenue", value: totalRevenue },
  ];

  // --- Revenue Trend Chart (group by day) ---
  const revenueByDate = useMemo(() => {
    if (!payments) return [];
    const grouped = payments.reduce((acc, p) => {
      if (p.status !== "paid") return acc;
      const date = new Date(p.transaction_date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + p.amount;
      return acc;
    }, {});
    return Object.entries(grouped).map(([date, total]) => ({
      date,
      total,
    }));
  }, [payments]);

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[400px] text-red-700">
        Please try again later 😢
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] text-muted-foreground">
        <Loader2 className="animate-spin mr-2" />
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-bold">🏨 Hotel Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Rooms"
          value={totalRooms}
          icon={<BedDouble className="text-primary" />}
        />
        <StatCard
          title="Reserved Rooms"
          value={reservedRooms}
          icon={<CalendarCheck className="text-green-500" />}
        />
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="text-blue-500" />}
        />
        <StatCard
          title="Total Revenue"
          value={`ETB ${totalRevenue}`}
          icon={<DollarSign className="text-yellow-500" />}
        />
      </div>

      {/* Enhanced Bar Chart */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Overview Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overviewData}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                {/* Background grid */}
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "13px",
                  }}
                />

                {/* Gradient fill */}
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.4} />
                  </linearGradient>
                </defs>

                {/* Bars */}
                <Bar
                  dataKey="value"
                  fill="url(#colorValue)"
                  radius={[10, 10, 0, 0]}
                  animationDuration={1200}
                  barSize={50}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fill: "#111827", fontSize: "12px" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Line Chart */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Revenue Trend (Recent Transactions)</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueByDate.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No revenue data available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
