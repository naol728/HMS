"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getallUsers } from "@/api/users";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function DashboardUsers() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["getallUsers"],
    queryFn: getallUsers,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading users...</span>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load users 😢
      </div>
    );

  const users = data || [];

  return (
    <Card className="max-w-6xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">All Users</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableCaption>A list of all users in the system.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
