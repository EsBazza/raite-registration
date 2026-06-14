import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function getUserById(id: string) {
  try {
    return await db.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return null;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    return await db.user.findUnique({
      where: { clerkId },
    });
  } catch (error) {
    console.error(`Failed to fetch user by Clerk ID ${clerkId}:`, error);
    return null;
  }
}

export async function getAllUserEmails() {
  try {
    const users = await db.user.findMany({
      select: { email: true },
    });
    return users.map((user) => user.email);
  } catch (error) {
    console.error("Failed to fetch all user emails:", error);
    return [];
  }
}

export async function getSubAdmins() {
  try {
    return await db.user.findMany({
      where: {
        role: Role.SUB_ADMIN,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch sub-admins:", error);
    return [];
  }
}
