import { db } from "@/lib/db";
import { RegistrationStatus } from "@prisma/client";

export async function getDashboardStats() {
  try {
    const [participantsCount, teamCount, activeCompetitionsCount] = await Promise.all([
      db.user.count({ where: { role: "PARTICIPANT" } }),
      db.registration.count({ where: { teamName: { not: null } } }),
      db.event.count({ where: { status: "UPCOMING" } }),
    ]);

    return {
      participantsCount,
      teamCount,
      activeCompetitionsCount,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      participantsCount: 0,
      teamCount: 0,
      activeCompetitionsCount: 0,
    };
  }
}

export async function getRegistrationsPerCompetition() {
  try {
    const events = await db.event.findMany({
      select: {
        title: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    return events.map((e) => ({
      name: e.title,
      count: e._count.registrations,
    }));
  } catch (error) {
    console.error("Failed to fetch registrations per competition:", error);
    return [];
  }
}

export async function getRegistrationsByClassification() {
  try {
    const users = await db.user.groupBy({
      by: ["role"],
      _count: {
        id: true,
      },
    });

    return users.map((u) => ({
      name: u.role as string,
      count: u._count.id,
    }));
  } catch (error) {
    console.error("Failed to fetch registrations by classification:", error);
    return [];
  }
}

export async function getRegistrationTrends() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrations = await db.registration.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Aggregation logic for daily counts
    const dailyCounts: Record<string, number> = {};
    registrations.forEach((reg) => {
      const date = reg.createdAt.toISOString().split("T")[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count,
    }));
  } catch (error) {
    console.error("Failed to fetch registration trends:", error);
    return [];
  }
}
