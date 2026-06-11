"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegistrationStatus, EventSubcategory } from "@prisma/client";
import { Pencil, Send, CheckCircle, ExternalLink, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import { submitEntryUrl } from "@/app/actions/registration";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Registration {
  id: string;
  status: RegistrationStatus;
  teamName: string | null;
  entryUrl: string | null;
  createdAt: string;
  user: {
    school: string | null;
  };
  event: {
    id: string;
    title: string;
    subcategory: EventSubcategory | null;
  };
}

export function MyRegistrationsTable({ registrations }: { registrations: Registration[] }) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null);
  const [entryUrl, setEntryUrl] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState<string | null>(null);

  const handleSubmitEntry = async (registrationId: string) => {
    if (!entryUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsSubmitting(registrationId);
    try {
      const result = await submitEntryUrl(registrationId, entryUrl);
      if (result.success) {
        toast.success("Entry submitted successfully!");
        setOpenDialog(null);
        setEntryUrl("");
      } else {
        toast.error(result.error || "Failed to submit entry");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(null);
    }
  };

  const columns: ColumnDef<Registration>[] = [
    {
      accessorKey: "event.title",
      header: "Competition",
      cell: ({ row }) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-gray-900 dark:text-white leading-tight">{row.original.event.title}</span>
          <span className="text-[10px] font-black uppercase tracking-tighter text-blue-600 mt-1 flex items-center gap-1">
             <Globe className="w-3 h-3" />
             {row.original.event.subcategory}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "user.school",
      header: "Institution",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {row.original.user?.school || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Approval Status",
      cell: ({ row }) => {
        const status = row.original.status as RegistrationStatus;
        return (
          <Badge 
            variant="outline" 
            className={cn(
              "font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border-2",
              status === "APPROVED" ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30 shadow-sm shadow-green-100" : 
              status === "REJECTED" ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 shadow-sm shadow-red-100" : 
              status === "PENDING" ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30 shadow-sm shadow-blue-100" : 
              "bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "entryStatus",
      header: "Entry Status",
      cell: ({ row }) => {
        const isOnline = row.original.event.subcategory === "ONLINE";
        if (!isOnline) return <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">N/A</span>;
        
        const hasSubmitted = !!row.original.entryUrl;
        const isApproved = row.original.status === "APPROVED";

        return (
          <div className="flex items-center gap-3">
            {hasSubmitted ? (
              <Badge className="bg-green-600 hover:bg-green-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full gap-1.5 border-0 shadow-sm shadow-green-100">
                <CheckCircle className="w-3.5 h-3.5" />
                Submitted
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border-2">
                Not Submitted
              </Badge>
            )}

            {isOnline && isApproved && !hasSubmitted && (
              <Dialog 
                open={openDialog === row.original.id} 
                onOpenChange={(open) => {
                  if (open) {
                    setOpenDialog(row.original.id);
                    setEntryUrl(row.original.entryUrl || "");
                  } else {
                    setOpenDialog(null);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="rounded-xl font-bold gap-2 h-8 px-3 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 text-[11px]"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Submit Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2rem] sm:max-w-md border-gray-100">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tight">Submit Competition Entry</DialogTitle>
                    <DialogDescription className="font-medium">
                      Provide the URL to your project, video, or document as required by the competition mechanics.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="entryUrl" className="text-xs font-black uppercase tracking-widest text-gray-500">Submission Link (URL)</Label>
                      <Input
                        id="entryUrl"
                        placeholder="https://docs.google.com/..."
                        value={entryUrl}
                        onChange={(e) => setEntryUrl(e.target.value)}
                        className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:ring-4 focus:ring-blue-500/10 font-medium"
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpenDialog(null)}
                      className="rounded-full font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleSubmitEntry(row.original.id)}
                      disabled={isSubmitting === row.original.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 font-bold shadow-lg shadow-blue-600/20"
                    >
                      {isSubmitting === row.original.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Link"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {hasSubmitted && (
               <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
                 <a href={row.original.entryUrl!} target="_blank" rel="noopener noreferrer" title="View Entry">
                    <ExternalLink className="h-4 w-4" />
                 </a>
               </Button>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold h-9 hover:bg-gray-100">
            <Link href={`/registrations/edit/${row.original.id}`}>
              <Pencil className="h-4 w-4 mr-2" /> Edit Info
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: registrations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[200px] rounded-xl border-2 font-bold focus:ring-0 shadow-none">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50/50 dark:bg-gray-800/30 border-b-2 border-gray-100 dark:border-gray-800 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="h-20 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                   <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400">
                         <Globe className="w-8 h-8 opacity-20" />
                      </div>
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No registrations found.</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
