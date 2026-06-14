import { seedSchools } from "./seed-schools";
import { db } from "@/lib/db";

async function run() {
  console.log("Seeding schools...");
  await seedSchools();
  console.log("Seeding complete.");
  await db.$disconnect();
}

run();