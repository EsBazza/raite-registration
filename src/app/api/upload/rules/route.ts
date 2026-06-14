import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `rules-${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    
    // Upload to Supabase Storage using Admin client
    const { data, error } = await supabaseAdmin.storage
      .from("rules")
      .upload(filename, buffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Storage error:", error);
      return NextResponse.json({ error: "Failed to upload to storage" }, { status: 500 });
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("rules")
      .getPublicUrl(filename);
    
    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 });
  }
}
