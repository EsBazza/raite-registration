"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function checkSubAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "SUB_ADMIN") throw new Error("Forbidden");
  return user;
}

export async function getSubAdminSubmissions(eventId: string) {
  await checkSubAdmin();

  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { title: true, subAdminId: true }
  });

  if (!event) throw new Error("Event not found");

  // Verify the sub-admin is assigned to this event
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (event.subAdminId !== user?.id) {
     throw new Error("Unauthorized to access this competition");
  }

  const registrations = await db.registration.findMany({
    where: { 
      eventId,
      AND: [
        { entryUrl: { not: null } },
        { entryUrl: { not: "" } }
      ]
    },
    include: {
      user: { select: { name: true, email: true, school: true } },
      event: { select: { subcategory: true } }
    },
    orderBy: { updatedAt: "desc" },
  });

  return registrations.map((r) => ({
    id: r.id,
    school: r.user.school || "N/A",
    teamName: r.teamName || "N/A",
    submissionUrl: r.entryUrl,
    submittedAt: r.updatedAt.toLocaleDateString(),
    subcategory: r.event.subcategory,
  }));
}

export async function getSubAdminEvents() {
  const user = await checkSubAdmin();
  
  return await db.event.findMany({
    where: { subAdminId: user.id },
    orderBy: { title: "asc" }
  });
}

async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function getAdminSubmissions(eventId: string) {
  await checkAdmin();

  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { title: true }
  });

  if (!event) throw new Error("Event not found");

  const registrations = await db.registration.findMany({
    where: { 
      eventId,
      AND: [
        { entryUrl: { not: null } },
        { entryUrl: { not: "" } }
      ]
    },
    include: {
      user: { select: { name: true, email: true, school: true } },
      event: { select: { subcategory: true } }
    },
    orderBy: { updatedAt: "desc" },
  });

  return registrations.map((r) => ({
    id: r.id,
    school: r.user.school || "N/A",
    teamName: r.teamName || "N/A",
    submissionUrl: r.entryUrl,
    submittedAt: r.updatedAt.toLocaleDateString(),
    subcategory: r.event.subcategory,
  }));
}

export async function getAdminEvents() {
  await checkAdmin();
  
  return await db.event.findMany({
    orderBy: { title: "asc" }
  });
}
