import { getAdminEvents } from "@/app/actions/submissions";
import AdminSubmissionsClient from "@/components/admin/AdminSubmissionsClient";
import { Event } from "@prisma/client";

export default async function AdminSubmissionsPage() {
  let events: Event[] = [];
  try {
    events = await getAdminEvents();
  } catch (error) {
    console.error("Failed to load events for admin:", error);
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Submissions</h1>
        <p className="text-gray-500 text-sm">View consolidated submissions links for all competitions and export them as CSV or PDF.</p>
      </div>

      <AdminSubmissionsClient events={events} />
    </div>
  );
}
