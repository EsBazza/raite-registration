import { redis } from "../src/lib/redis";

async function testRedis() {
  if (!redis) {
    console.error("❌ Redis is not configured. Check UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your .env");
    return;
  }

  try {
    console.log("Testing Redis connection...");
    await redis.set("test-key", "hello-world");
    const value = await redis.get("test-key");
    
    if (value === "hello-world") {
      console.log("✅ Redis is working properly!");
    } else {
      console.error("❌ Redis set/get failed. Returned:", value);
    }
  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
}

testRedis();
