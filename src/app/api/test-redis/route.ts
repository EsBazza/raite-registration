import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  if (!redis) {
    return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
  }
   
  try {
    await redis.set("test-key", "hello-world");
    const value = await redis.get("test-key");
    return NextResponse.json({ success: true, value });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}