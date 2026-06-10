import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function getUserById(id: string) {
  return await db.user.findUnique({
    where: { id },
  });
}

export async function getUserByClerkId(clerkId: string) {
  return await db.user.findUnique({
    where: { clerkId },
  });
}

export async function getAllUserEmails() {
  const users = await db.user.findMany({
    select: { email: true },
  });
  return users.map((user) => user.email);
}

export async function getSubAdmins() {
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
}
