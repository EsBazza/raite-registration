import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

const SETTINGS_CACHE_PREFIX = "setting:";
const CACHE_TTL = 3600; // 1 hour

export async function getSystemSetting(key: string) {
  try {
    // Try cache first
    if (redis) {
      const cached = await redis.get(`${SETTINGS_CACHE_PREFIX}${key}`);
      if (cached !== null) return cached as string;
    }

    const model = (db as any).systemSetting;
    if (!model) {
      console.warn("systemSetting model is missing from Prisma Client instance!");
      return null;
    }

    const setting = await model.findUnique({
      where: { key },
    });
    
    const value = setting?.value || null;

    // Update cache
    if (redis && value !== null) {
      await redis.set(`${SETTINGS_CACHE_PREFIX}${key}`, value, { ex: CACHE_TTL });
    }

    return value;
  } catch (error) {
    console.error(`Error fetching system setting ${key}:`, error);
    return null;
  }
}

export async function getAllSystemSettings() {
  try {
    const model = (db as any).systemSetting;
    if (!model) {
      console.warn("systemSetting model is missing from Prisma Client instance!");
      return {};
    }

    const settings = await model.findMany();
    const result = settings.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    // Batch update cache
    if (redis) {
      for (const [key, value] of Object.entries(result)) {
        await redis.set(`${SETTINGS_CACHE_PREFIX}${key}`, value, { ex: CACHE_TTL });
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching all system settings:", error);
    return {};
  }
}

