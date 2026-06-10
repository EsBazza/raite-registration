"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Loader2,
  Eye,
  FileText
} from "lucide-react";
import { updateRegistrationStatus } from "@/app/actions/registrations";
import { getRegistrationDetails } from "@/app/actions/reports";
import { RegistrationStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SubAdminExportButtons from "./SubAdminExportButtons";

interface Registration {
  id: string;
  status: RegistrationStatus;
  teamName: string | null;
  requirements: any;
  requirementsVerified: boolean;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
    school: string | null;
  };
  event: {
    id: string;
    title: string;
  };
}

function RegistrationDetailsModal({ registration }: { registration: Registration }) {
  const [details, setDetails] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const data = await getRegistrationDetails(registration.id);
      setDetails(data);
    } catch (error) {
      toast.error("Failed to load registration details");
    } finally {
      setIsLoading(false);
    }
  };

  const requirements = typeof registration.requirements === 'string' 
    ? JSON.parse(registration.requirements) 
    : registration.requirements;
    
  const documents = requirements?.documents || [];

  // If requirements is stored as key-value pairs of URLs (as seen in submitRegistration)
  const documentEntries = !Array.isArray(requirements) && typeof requirements === 'object' && requirements !== null
    ? Object.entries(requirements).filter(([key]) => key !== 'participants' && key !== 'members')
    : [];

  return (
    <Dialog onOpenChange={(open) => open && fetchDetails()}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs">
          <Eye className="h-3.5 w-3.5" /> View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Registration Details</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading details...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500">School / Institution</p>
                <p className="font-bold text-lg">{registration.user.school || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500">Coach / Registered By</p>
                <p className="font-bold text-lg">{details?.coach?.name || registration.user.name}</p>
                <p className="text-xs text-gray-500">{details?.coach?.email || registration.user.email}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-4">Registered Participants</p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Unique ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details?.memberDetails?.length > 0 ? (
                      details.memberDetails.map((m: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-bold">{m.name}</TableCell>
                          <TableCell className="text-gray-500">{m.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-[10px]">{m.id}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 py-4">No participants found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-4">Uploaded Documents</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documentEntries.length > 0 ? (
                  documentEntries.map(([name, url]: any, i: number) => (
                    <a key={i} href={url} target="_blank" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight truncate">{name.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Click to view document</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-6 rounded-xl text-center w-full col-span-2">No documents uploaded.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function SubAdminRegistrationsTable({ initialData, eventId }: { initialData: Registration[], eventId: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: RegistrationStatus) => {
    setIsUpdating(id);
    const result = await updateRegistrationStatus({ id, status });
    if (result.success) {
      toast.success(`Registration ${status.toLowerCase()}`);
      router.refresh();
    } else {
      toast.error(result.error || "Update failed");
    }
    setIsUpdating(null);
  };

  const columns: ColumnDef<Registration>[] = [
    {
      accessorKey: "user.school",
      header: "School / Institution",
      cell: ({ row }) => (
        <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
          {row.original.user.school || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Registered On",
      cell: ({ row }) => (
        <span className="text-xs text-gray-500">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "requirementsVerified",
      header: "Verified",
      cell: ({ row }) => (
        <Badge variant={row.original.requirementsVerified ? "default" : "secondary"}>
          {row.original.requirementsVerified ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as RegistrationStatus;
        return (
          <Badge 
            variant="outline" 
            className={cn(
              "font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border-2",
              status === "APPROVED" ? "bg-green-50 text-green-700 border-green-100" : 
              status === "REJECTED" ? "bg-red-50 text-red-700 border-red-100" : 
              status === "PENDING" ? "bg-blue-50 text-blue-700 border-blue-100" : 
              "bg-gray-50 text-gray-700 border-gray-100"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => <RegistrationDetailsModal registration={row.original} />
    },
  ];

  const table = useReactTable({
    data: initialData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SubAdminExportButtons eventId={eventId} />
      </div>
      <div className="rounded-2xl border-2 border-gray-100 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50/50 border-b-2 border-gray-100 hover:bg-transparent">
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
                <TableRow key={row.id} className="h-20 hover:bg-gray-50/50 transition-all border-b border-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                  No registrations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
