"use client";

import { Event } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Edit, Users, School, Trophy } from "lucide-react";
import Link from "next/link";

interface SubAdminCompetitionsTableProps {
  events: (Event & { registeredSchools: string[], coaches: string[] })[];
}

export default function SubAdminCompetitionsTable({ events }: SubAdminCompetitionsTableProps) {
  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">No competitions assigned to you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start">
              
              {/* Competition Info */}
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{event.title}</h3>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50">
                  {event.category}
                </Badge>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={event.status === "UPCOMING" ? "default" : "secondary"}>
                    {event.status}
                  </Badge>
                </div>
              </div>

              {/* Registered Schools & Coaches List */}
              <div className="flex-1 w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Registered Participants</p>
                <div className="max-h-[150px] overflow-y-auto space-y-1 pr-2">
                  {event.registeredSchools.length > 0 ? (
                    event.registeredSchools.map((school, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 text-xs bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                        <span className="font-bold text-gray-900 dark:text-gray-100 truncate">{school}</span>
                        <span className="text-gray-500 truncate text-[10px]">{event.coaches[i] || "N/A"}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No registrations yet</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 min-w-[150px]">
                <Link 
                  href={`/sub-admin/competitions/${event.id}/edit`} 
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start gap-3 rounded-xl")}
                >
                  <Edit className="h-4 w-4" /> Edit
                </Link>
                <Link 
                  href={`/sub-admin/competitions/${event.id}/registrations`} 
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-start gap-3 rounded-xl")}
                >
                  <Eye className="h-4 w-4" /> View Registrations
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
