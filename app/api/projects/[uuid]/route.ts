import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getProjectById, updateProject, deleteProject } from "@/lib/db";
import { projectUpdateSchema } from "@/lib/schemas";

interface RouteParams {
  params: Promise<{ uuid: string }>;
}

// GET /api/projects/[uuid] - Get a single project
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { uuid } = await params;
    const project = await getProjectById(uuid);

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Failed to fetch project", error: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[uuid] - Update a project (requires auth)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { uuid } = await params;

    // Parse and validate request body
    const body = await req.json();
    const result = projectUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.issues },
        { status: 400 }
      );
    }

    // Update the project
    const updated = await updateProject(uuid, result.data);

    if (!updated) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Project updated", data: updated });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Failed to update project", error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[uuid] - Delete a project (requires auth)
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { uuid } = await params;
    const deleted = await deleteProject(uuid);

    if (!deleted) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Project deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Failed to delete project", error: String(error) },
      { status: 500 }
    );
  }
}
