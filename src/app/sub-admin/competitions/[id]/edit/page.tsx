import { getEventById } from "@/lib/data/events";
import CompetitionForm from "@/components/admin/CompetitionForm";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/data/users";

export default async function SubAdminEditCompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  const user = userId ? await getUserByClerkId(userId) : null;

  if (!user || user.role !== "SUB_ADMIN") {
    redirect("/");
  }

  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  // Security check: Is this sub-admin assigned to this event?
  if (event.subAdminId !== user.id) {
    redirect("/sub-admin/competitions");
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-4">
        <Link href="/sub-admin/competitions" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to my competitions
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Competition</h1>
          <p className="text-gray-500">Update details for "{event.title}". Some fields are restricted.</p>
        </div>
      </div>

      <CompetitionForm initialData={event} isSubAdmin={true} />
    </div>
  );
}
