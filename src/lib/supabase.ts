import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseKey) {
  throw new Error("Supabase API key is missing (neither publishable nor anon key found)");
}

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL.trim(),
  supabaseKey.trim()
);

// Admin client for server-side operations (e.g. storage uploads)
export const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(env.NEXT_PUBLIC_SUPABASE_URL.trim(), env.SUPABASE_SERVICE_ROLE_KEY.trim())
  : supabase; // Fallback to anon client if secret key is missing (local dev)

/**
 * Parses a Supabase public storage URL and deletes the associated file.
 * URL format: [NEXT_PUBLIC_SUPABASE_URL]/storage/v1/object/public/[bucket]/[file-path]
 */
export async function deleteSupabaseFile(url: string | null | undefined) {
  if (!url) return;
  try {
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL.trim();
    const cleanUrl = url.split(/[?#]/)[0];
    
    // Normalize URLs for comparison
    const baseUrl = supabaseUrl.endsWith("/") ? supabaseUrl : `${supabaseUrl}/`;
    const storagePrefix = `${baseUrl}storage/v1/object/public/`;
    
    if (!cleanUrl.startsWith(storagePrefix)) {
      console.warn("URL does not start with Supabase storage public URL prefix:", cleanUrl);
      return;
    }
    
    const pathAndBucket = cleanUrl.substring(storagePrefix.length);
    const firstSlashIndex = pathAndBucket.indexOf("/");
    if (firstSlashIndex === -1) {
      console.warn("Invalid Supabase storage URL structure:", cleanUrl);
      return;
    }
    
    const bucket = pathAndBucket.substring(0, firstSlashIndex);
    const filePath = pathAndBucket.substring(firstSlashIndex + 1);
    
    if (!bucket || !filePath) {
      console.warn("Could not parse bucket or file path from URL:", cleanUrl);
      return;
    }
    
    const { error } = await supabaseAdmin.storage.from(bucket).remove([filePath]);
    if (error) {
      console.error(`Failed to delete file from Supabase storage (bucket: ${bucket}, path: ${filePath}):`, error);
    } else {
      console.log(`Successfully deleted file from Supabase storage (bucket: ${bucket}, path: ${filePath})`);
    }
  } catch (error) {
    console.error("Error in deleteSupabaseFile:", error);
  }
}

