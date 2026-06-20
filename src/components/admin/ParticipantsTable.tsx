"use client";

import { User, School } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleUserApproval } from "@/app/actions/participants";
import { cn } from "@/lib/utils";

function ApprovalCell({ userId, initialApproved }: { userId: string; initialApproved: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [approved, setApproved] = useState(initialApproved);

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const res = await toggleUserApproval(userId);
        if (res.success) {
          setApproved(res.approved);
          toast.success("User approval status updated.");
        } else {
          toast.error("Failed to update user approval.");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to update user approval.");
      }
    });
  };

  return (
    <Button
      variant={approved ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "rounded-xl font-bold h-9 px-3 transition-all text-xs",
        approved 
          ? "bg-green-600 hover:bg-green-700 text-white border-none shadow-md shadow-green-600/20" 
          : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-950/20"
      )}
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : approved ? (
        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Approved</span>
      ) : (
        <span className="flex items-center gap-1"><X className="w-3.5 h-3.5" /> Unapproved</span>
      )}
    </Button>
  );
}

interface ParticipantsTableProps {
  participants: User[];
  totalPages: number;
  currentPage: number;
  schools: School[];
}

export default function ParticipantsTable({
  participants,
  totalPages,
  currentPage,
  schools,
}: ParticipantsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin/users?${params.toString()}`);
  };

  const getFullSchoolName = (schoolAbbr: string | null) => {
    if (!schoolAbbr) return "N/A";
    const school = schools.find((s) => s.abbreviation === schoolAbbr || s.name === schoolAbbr);
    return school ? school.name : schoolAbbr;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-[800px] lg:min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 border-b-2 border-gray-100 dark:border-gray-800 hover:bg-transparent">
                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Name</TableHead>
                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Email</TableHead>
                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">School</TableHead>
                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Course</TableHead>
                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Role</TableHead>
                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Approved</TableHead>
                <TableHead className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 px-6">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                participants.map((user) => (
                  <TableRow key={user.id} className="h-20 transition-all border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group">
                    <TableCell className="px-6 font-bold text-gray-900 dark:text-white">{user.name || "N/A"}</TableCell>
                    <TableCell className="px-6 text-sm font-medium text-gray-500">{user.email}</TableCell>
                    <TableCell className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{getFullSchoolName(user.school)}</TableCell>
                    <TableCell className="px-6 text-sm font-medium text-gray-600 dark:text-gray-400">{user.course || "N/A"}</TableCell>
                    <TableCell className="px-6">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="px-6">
                      <ApprovalCell userId={user.id} initialApproved={(user as any).approved} />
                    </TableCell>
                    <TableCell className="px-6 text-xs font-bold text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-xl border-2 font-bold px-4 h-10 dark:bg-gray-900 dark:border-gray-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-xl border-2 font-bold px-4 h-10 dark:bg-gray-900 dark:border-gray-800"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
