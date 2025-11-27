import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const img = formData.get("img") as string;
    const link = formData.get("link") as string;
    const keywordsRaw = formData.get("keywords") as string;

    // Parse keywords - they come as JSON string
    let keywords: string[] = [];
    try {
      keywords = keywordsRaw ? JSON.parse(keywordsRaw) : [];
    } catch {
      keywords = [];
    }

    // TODO: (recommended) validate here again with Zod
    // TODO: persist to DB (Prisma/Drizzle/etc.)
    // TODO: revalidatePath("/projects") after write (if using Next cache)

    console.log({
      project: { title, description, img, link, keywords },
    });

    return Response.json(
      { ok: true, project: { title, description, img, link, keywords } },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
