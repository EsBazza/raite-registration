import { db } from "@/lib/db";

export async function getSchools() {
  "use cache";
  try {
    return await db.school.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch schools:", error);
    return [];
  }
}

export async function getSchoolByAbbreviation(abbreviation: string) {
  try {
    return await db.school.findUnique({
      where: { abbreviation },
    });
  } catch (error) {
    console.error(`Failed to fetch school ${abbreviation}:`, error);
    return null;
  }
}

export async function getSchoolByName(name: string) {
  try {
    return await db.school.findUnique({
      where: { name },
    });
  } catch (error) {
    console.error(`Failed to fetch school by name ${name}:`, error);
    return null;
  }
}
