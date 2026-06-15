"use client";

import { useState } from "react";
import { Event, EventStatus } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { deleteCompetition, toggleRegistrationStatus } from "@/app/actions/competitions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CompetitionsTableProps {
  events: Event[];
}

export default function CompetitionsTable({ events }: CompetitionsTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this competition? This will also delete all associated registrations.")) return;
    
    setIsDeleting(id);
    try {
      await deleteCompetition(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete competition:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: EventStatus) => {
    const isOpen = currentStatus === "UPCOMING";
    try {
      await toggleRegistrationStatus(id, !isOpen);
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  return (
    <div className="rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 border-b-2 border-gray-100 dark:border-gray-800 hover:bg-transparent">
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Title</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Category</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Status</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6 text-center">Reg. Limit (Team Size)</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Start Date</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                  No competitions found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id} className="h-20 transition-all border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  <TableCell className="px-6 font-bold text-gray-900 dark:text-white">{event.title}</TableCell>
                  <TableCell className="px-6">
                    <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50">
                      {event.category || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border-2",
                        event.status === "UPCOMING" ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30" : 
                        "bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                      )}
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-center font-bold text-gray-600 dark:text-gray-400">
                    {event.maxRegistrations || "∞"} ({event.maxParticipantsPerRegistration})
                  </TableCell>
                  <TableCell className="px-6 text-xs font-bold text-gray-400">
                    {new Date(event.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center justify-center">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-gray-100 dark:border-gray-800">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/competitions/${event.id}/edit`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(event.id, event.status)}>
                          {event.status === "UPCOMING" ? (
                            <><PowerOff className="mr-2 h-4 w-4 text-orange-500" /> Close Reg</>
                          ) : (
                            <><Power className="mr-2 h-4 w-4 text-green-500" /> Open Reg</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 focus:bg-red-50 focus:text-red-600" 
                          onClick={() => handleDelete(event.id)}
                          disabled={isDeleting === event.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> 
                          {isDeleting === event.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
