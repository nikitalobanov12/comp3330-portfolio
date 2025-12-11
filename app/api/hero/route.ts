import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getHero, upsertHero } from "@/lib/db";
import { heroSchema } from "@/lib/schemas";
import image2uri from "image2uri";
import fs from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";

// Map file extensions to MIME types
const extTypeMap: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
};

/**
 * Convert an uploaded file to a data URL, or return the fallback string.
 */
async function toDataUrl(
  file: File | null,
  fallbackString: string | null
): Promise<string> {
  const fallback =
    typeof fallbackString === "string" ? fallbackString.trim() : "";

  if (file && typeof file.arrayBuffer === "function") {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(file.name || "") || ".bin";
    const mime = extTypeMap[ext.toLowerCase()] ?? file.type ?? "application/octet-stream";
    const tmp = path.join(os.tmpdir(), `${randomUUID()}${ext}`);

    fs.writeFileSync(tmp, buffer);

    try {
      const uri = await image2uri(tmp, { ext });
      // image2uri may return just the base64 string without the data URI prefix
      return uri.startsWith("data:") ? uri : `data:${mime};base64,${uri}`;
    } finally {
      fs.rmSync(tmp, { force: true });
    }
  }

  return fallback;
}

// GET /api/hero - Public endpoint to fetch hero data
export async function GET() {
  try {
    const hero = await getHero();
    return NextResponse.json({ data: hero });
  } catch (error) {
    console.error("Error fetching hero:", error);
    return NextResponse.json(
      { message: "Failed to fetch hero data", error: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/hero - Authenticated endpoint to update hero data
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "You must be logged in to edit the hero section" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const avatarFile = formData.get("avatarFile") as File | null;
    const avatarFromForm = formData.get("avatar") as string | null;

    // Convert file to data URL if provided, otherwise use existing avatar
    const avatarDataUrl = await toDataUrl(avatarFile, avatarFromForm);

    // Validate payload with zod
    const parseResult = heroSchema.safeParse({
      avatar: avatarDataUrl || "",
      fullName: formData.get("fullName") || "",
      shortDescription: formData.get("shortDescription") || "",
      longDescription: formData.get("longDescription") || "",
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parseResult.error.issues },
        { status: 400 }
      );
    }

    // Upsert hero data
    const hero = await upsertHero(parseResult.data);

    return NextResponse.json(
      { message: "Hero updated", data: hero },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating hero:", error);
    return NextResponse.json(
      { message: "Failed to update hero", error: String(error) },
      { status: 500 }
    );
  }
}
