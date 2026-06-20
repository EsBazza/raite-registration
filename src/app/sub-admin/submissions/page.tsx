import { getSubAdminEvents } from "@/app/actions/submissions";
import SubAdminSubmissionsClient from "@/components/sub-admin/SubAdminSubmissionsClient";
import { Event } from "@prisma/client";

export default async function SubAdminSubmissionsPage() {
  let events: Event[] = [];
  try {
    events = await getSubAdminEvents();
  } catch (error) {
    console.error("Failed to load events for sub-admin:", error);
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Submissions</h1>
        <p className="text-gray-500 text-sm">View consolidated submissions links per competition and export them as CSV or PDF.</p>
      </div>

      <SubAdminSubmissionsClient events={events} />
    </div>
  );
}
