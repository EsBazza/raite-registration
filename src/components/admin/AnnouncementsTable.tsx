"use client";

import { Announcement } from "@prisma/client";
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
import { MoreHorizontal, Edit, Pin, PinOff, Archive, ArchiveRestore } from "lucide-react";
import { togglePinAnnouncement, toggleArchiveAnnouncement } from "@/app/actions/announcements";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface AnnouncementsTableProps {
  announcements: Announcement[];
}

export default function AnnouncementsTable({ announcements }: AnnouncementsTableProps) {
  const router = useRouter();

  const handlePin = async (id: string, current: boolean) => {
    const result = await togglePinAnnouncement(id, !current);
    if (result.success) {
      toast.success(current ? "Announcement unpinned" : "Announcement pinned");
      router.refresh();
    }
  };

  const handleArchive = async (id: string, current: boolean) => {
    const result = await toggleArchiveAnnouncement(id, !current);
    if (result.success) {
      toast.success(current ? "Announcement restored" : "Announcement archived");
      router.refresh();
    }
  };

  return (
    <div className="rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 overflow-hidden shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 border-b-2 border-gray-100 dark:border-gray-800 hover:bg-transparent">
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Title</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Pinned</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Status</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Created At</TableHead>
              <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                  No announcements found.
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((announcement) => (
                <TableRow key={announcement.id} className="h-20 transition-all border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                  <TableCell className="px-6 font-bold text-gray-900 dark:text-white">{announcement.title}</TableCell>
                  <TableCell className="px-6">
                    {announcement.pinned ? (
                      <Badge className="font-black text-[10px] uppercase tracking-widest text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50">Yes</Badge>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest italic">No</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border-2",
                        announcement.isArchived ? "bg-gray-50 text-gray-700 border-gray-100" : "bg-green-50 text-green-700 border-green-100"
                      )}
                    >
                      {announcement.isArchived ? "Archived" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-xs font-bold text-gray-400">
                    {new Date(announcement.createdAt).toLocaleDateString()}
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
                          <Link href={`/admin/announcements/${announcement.id}/edit`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePin(announcement.id, announcement.pinned)}>
                          {announcement.pinned ? (
                            <><PinOff className="mr-2 h-4 w-4" /> Unpin</>
                          ) : (
                            <><Pin className="mr-2 h-4 w-4 text-blue-600" /> Pin</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchive(announcement.id, announcement.isArchived)}>
                          {announcement.isArchived ? (
                            <><ArchiveRestore className="mr-2 h-4 w-4 text-green-600" /> Restore</>
                          ) : (
                            <><Archive className="mr-2 h-4 w-4 text-orange-500" /> Archive</>
                          )}
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
