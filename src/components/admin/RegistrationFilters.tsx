"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { EventStatus, EventSubcategory } from "@prisma/client";

interface Event {
  id: string;
  title: string;
  subcategory: EventSubcategory | null;
  status: EventStatus;
}

export default function RegistrationFilters({ events }: { events: Event[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedEventId = searchParams.get("eventId");
  const selectedEvent = events.find(e => e.id === selectedEventId);
  const isOnlineRelevant = !selectedEventId || selectedEvent?.subcategory === "ONLINE" || selectedEvent?.subcategory === "ONSITE_PAGEANT";

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.replace(pathname);
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search school, coach or email..."
            className="pl-10 h-11 rounded-xl border-2 focus:ring-blue-500/10 transition-all"
            defaultValue={searchParams.get("search")?.toString()}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex items-center gap-2 w-full md:w-auto">
          <Select
            value={searchParams.get("eventId")?.toString() || "all"}
            onValueChange={(v) => updateFilters({ eventId: v === "all" ? null : v, status: null })}
          >
            <SelectTrigger className="w-full md:w-[240px] min-w-0 h-11 rounded-xl border-2 font-bold focus:ring-0 shadow-none overflow-hidden flex items-center justify-between">
              <SelectValue placeholder="Event" className="truncate text-left flex-1 min-w-0 pr-2">
                {selectedEvent ? selectedEvent.title : "All Events"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 w-full md:w-auto min-w-0">
            <Select
              value={searchParams.get("status")?.toString() || "all"}
              onValueChange={(v) => updateFilters({ status: v === "all" ? null : v })}
            >
              <SelectTrigger className="flex-1 md:w-[180px] min-w-0 h-11 rounded-xl border-2 font-bold focus:ring-0 shadow-none overflow-hidden flex items-center justify-between">
                <SelectValue placeholder="Status" className="truncate text-left flex-1 min-w-0 pr-2" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">To Review</SelectItem>
                {isOnlineRelevant && (
                  <>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="NOT_SUBMITTED">Not Submitted</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={clearFilters} className="h-11 w-11 rounded-xl border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
