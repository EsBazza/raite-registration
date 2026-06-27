import { db } from "@/lib/db";

export async function getUpcomingEvents() {
  "use cache";
  try {
    return await db.event.findMany({
      where: {
        status: "UPCOMING",
      },
      orderBy: {
        startDate: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    return [];
  }
}

export async function getAllEvents() {
  "use cache";
  try {
    return await db.event.findMany({
      orderBy: {
        title: "asc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch all events:", error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    return await db.event.findUnique({
      where: { id },
      include: {
        subAdmin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
}

export async function getDistinctCategories() {
  "use cache";
  try {
    const events = await db.event.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      where: {
        category: {
          not: null,
        },
      },
    });

    return events.map((e) => e.category as string);
  } catch (error) {
    console.error("Failed to fetch distinct categories:", error);
    return [];
  }
}
