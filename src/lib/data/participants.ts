import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface ParticipantFilters {
  search?: string;
  school?: string;
  course?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getPaginatedParticipants(page: number = 1, limit: number = 10, filters: ParticipantFilters = {}) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: filters.role ? (filters.role as any) : { in: ["PARTICIPANT", "FACULTY_COACH"] },
      AND: [
        filters.search ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { school: { contains: filters.search, mode: "insensitive" } },
          ],
        } : {},
        filters.school ? { school: filters.school } : {},
        filters.course ? { course: filters.course } : {},
      ],
    };

    const orderBy: Prisma.UserOrderByWithRelationInput = filters.sortBy 
      ? { [filters.sortBy]: filters.sortOrder || "asc" }
      : { createdAt: "desc" };

    const [participants, totalCount] = await Promise.all([
      db.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return {
      participants,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("Failed to fetch paginated participants:", error);
    return {
      participants: [],
      totalCount: 0,
      totalPages: 0,
    };
  }
}

export async function getAllParticipantsForExport(filters: ParticipantFilters = {}) {
  try {
    const where: Prisma.UserWhereInput = {
      role: filters.role ? (filters.role as any) : { in: ["PARTICIPANT", "FACULTY_COACH"] },
      AND: [
        filters.search ? {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { school: { contains: filters.search, mode: "insensitive" } },
          ],
        } : {},
        filters.school ? { school: filters.school } : {},
        filters.course ? { course: filters.course } : {},
      ],
    };

    return await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch all participants for export:", error);
    return [];
  }
}
