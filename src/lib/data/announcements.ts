import { db } from "@/lib/db";
import { Announcement } from "@prisma/client";

export async function getLatestAnnouncements(limit: number = 3): Promise<Announcement[]> {
  "use cache";
  try {
    return await db.announcement.findMany({
      where: {
        isArchived: false,
      },
      orderBy: [
        { pinned: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });
  } catch (error) {
    console.error("Failed to fetch latest announcements:", error);
    return [];
  }
}

export async function getAnnouncementById(id: string) {
  try {
    return await db.announcement.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to fetch announcement ${id}:`, error);
    return null;
  }
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  "use cache";
  try {
    return await db.announcement.findMany({
      orderBy: [
        { pinned: "desc" },
        { createdAt: "desc" },
      ],
    });
  } catch (error) {
    console.error("Failed to fetch all announcements:", error);
    return [];
  }
}
