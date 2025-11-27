import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { insertProject } from "@/lib/db";
import { projectSchema } from "@/lib/schemas";

// POST /api/projects/new - Create a new project (requires auth)
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const contentType = req.headers.get("content-type");
    let data;

    if (contentType?.includes("application/json")) {
      data = await req.json();
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const keywordsRaw = formData.get("keywords") as string;
      let keywords: string[] = [];
      try {
        keywords = keywordsRaw ? JSON.parse(keywordsRaw) : [];
      } catch {
        keywords = [];
      }
      data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        image: formData.get("img") as string,
        link: formData.get("link") as string,
        keywords,
      };
    } else {
      return NextResponse.json(
        { message: "Unsupported content type" },
        { status: 415 }
      );
    }

    // Validate with Zod
    const result = projectSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.issues },
        { status: 400 }
      );
    }

    // Insert into database
    const project = await insertProject(result.data);

    return NextResponse.json(
      { message: "Project created", data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Failed to create project", error: String(error) },
      { status: 500 }
    );
  }
}
