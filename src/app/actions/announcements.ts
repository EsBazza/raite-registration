"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendBrevoEmail } from "@/lib/email";
import { getAllUserEmails } from "@/lib/data/users";
import { deleteSupabaseFile } from "@/lib/supabase";

const announcementSchema = z.object({
  title: z.string().min(2, "Title is required"),
  facebookUrl: z.string().trim().url("Invalid Facebook URL").optional().or(z.literal("")),
  imageUrl: z.string().trim().url("Invalid image URL").optional().or(z.literal("")),
  content: z.string().min(10, "Content is required"),
  pinned: z.boolean().default(false),
});

async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "ADMIN") throw new Error("Forbidden");
  return user;
}

export async function createAnnouncement(data: z.infer<typeof announcementSchema>) {
  try {
    await checkAdmin();
    const validated = announcementSchema.parse(data);

    const announcement = await db.announcement.create({
      data: validated,
    });

    // Broadcast email
    const emails = await getAllUserEmails();
    if (emails.length > 0) {
      await sendBrevoEmail({
        subject: `New Announcement: ${announcement.title}`,
        htmlContent: `
          <h1>${announcement.title}</h1>
          <p>${announcement.content}</p>
          ${announcement.facebookUrl ? `<p><a href="${announcement.facebookUrl}">View on Facebook</a></p>` : ""}
        `,
        to: emails.map(email => ({ email })),
      });
    }

    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Create announcement error:", error);
    return { error: error.message || "Failed to create announcement" };
  }
}

export async function updateAnnouncement(id: string, data: z.infer<typeof announcementSchema>) {
  try {
    await checkAdmin();
    const validated = announcementSchema.parse(data);

    await db.announcement.update({
      where: { id },
      data: validated,
    });
    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Update announcement error:", error);
    return { error: error.message || "Failed to update announcement" };
  }
}

export async function togglePinAnnouncement(id: string, pinned: boolean) {
  await checkAdmin();

  try {
    await db.announcement.update({
      where: { id },
      data: { pinned },
    });
    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to pin announcement" };
  }
}

export async function toggleArchiveAnnouncement(id: string, isArchived: boolean) {
  await checkAdmin();

  try {
    await db.announcement.update({
      where: { id },
      data: { isArchived },
    });
    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to archive announcement" };
  }
}

export async function deleteAnnouncement(id: string) {
  await checkAdmin();

  try {
    const announcement = await db.announcement.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    await db.announcement.delete({
      where: { id },
    });

    if (announcement?.imageUrl) {
      await deleteSupabaseFile(announcement.imageUrl);
    }

    revalidatePath("/admin/announcements");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete announcement" };
  }
}
