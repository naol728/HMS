"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useRoom from "@/hooks/room/useRoom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRoom } from "@/api/room";
import RoomForm from "@/components/dashboard/RoomForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusSquare } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Edit2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import EditRoom from "@/components/dashboard/EditRoom";

export function DashboardRooms() {
  const [sorting, setSorting] = React.useState([]);
  const { data = [], isLoading } = useRoom();
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const queryclinet = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: deleteRoom,
    mutationKey: ["deleteRoom"],
    onSuccess: () => {
      toast.success("Sucessfully deleted Room");
      queryclinet.invalidateQueries({ queryKey: ["getRooms"] });
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });

  const columns = [
    {
      accessorKey: "room_number",
      header: "Room No",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("room_number")}</div>
      ),
    },
    {
      accessorKey: "price_per_night",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price Per Night
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price_per_night"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "ETB",
        }).format(amount);
        return <div className="ml-5">{formatted}</div>;
      },
    },
    {
      accessorKey: "discount",
      header: () => <div className="text-right">Discount</div>,
      cell: ({ row }) => (
        <div className="text-right text-green-600 font-medium">
          {parseFloat(row.getValue("discount"))}%
        </div>
      ),
    },
    {
      accessorKey: "image_url",
      header: () => <div className="text-center">Image</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <img
            className="w-16 h-16 rounded-lg border object-cover"
            src={row.getValue("image_url")?.[0]}
            alt="Room"
          />
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue("status");
        const colors = {
          available: "bg-green-100 text-green-700",
          reserved: "bg-yellow-100 text-yellow-700",
          occupied: "bg-red-100 text-red-700",
        };
        return (
          <div className="flex justify-center">
            <Badge className={colors[status] || "bg-gray-200 text-gray-700"}>
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: () => <div className="text-center">Type</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left">Description</div>,
      cell: ({ row }) => {
        const text = row.getValue("description") || "";
        return (
          <div className="truncate max-w-xs text-muted-foreground">{text}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-left">Actions</div>,
      cell: ({ row }) => {
        const room = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(room.id)}
              >
                Copy Room ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Sheet>
                <SheetTrigger>
                  <Button variant="default">
                    Edit room <Edit2 />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <EditRoom room={room} />
                </SheetContent>
              </Sheet>
              <DropdownMenuSeparator />
              <Button
                variant="destructive"
                onClick={() => mutate(room.id)}
                disabled={isPending}
              >
                Delete room <Trash2 />
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          🏨 Rooms Mangement
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="flex items-center gap-2 px-6">
              <PlusSquare className="w-5 h-5" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <RoomForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search rooms..."
          value={table.getColumn("room_number")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("room_number")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No rooms found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} selected
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
