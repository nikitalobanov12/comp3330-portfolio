"use server";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

function getSQL(): NeonQueryFunction<false, false> {
  const dbUrl = process.env.NEON_DB_URL;
  if (!dbUrl) {
    throw new Error("NEON_DB_URL environment variable is not set");
  }
  return neon(dbUrl);
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectRow {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  keywords: string[];
  created_at: Date;
  updated_at: Date;
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    link: row.link,
    keywords: row.keywords ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function ensureProjectsTable(): Promise<void> {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text NOT NULL,
      image text NOT NULL,
      link text NOT NULL,
      keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export interface SeedProject {
  title: string;
  description: string;
  image: string;
  link: string;
  keywords: string[];
}

export async function seedProjectsTable(seed: SeedProject[]): Promise<void> {
  const sql = getSQL();
  for (const item of seed) {
    await sql`
      INSERT INTO projects (title, description, image, link, keywords)
      VALUES (${item.title}, ${item.description}, ${item.image}, ${item.link}, ${JSON.stringify(item.keywords)})
      ON CONFLICT DO NOTHING
    `;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  const sql = getSQL();
  const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  return rows.map((row) => mapProject(row as ProjectRow));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const sql = getSQL();
  const rows = await sql`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
  const row = rows[0] as ProjectRow | undefined;
  return row ? mapProject(row) : null;
}

export interface InsertProjectData {
  title: string;
  description: string;
  image: string;
  link: string;
  keywords: string[];
}

export async function insertProject(data: InsertProjectData): Promise<Project> {
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO projects (title, description, image, link, keywords)
    VALUES (${data.title}, ${data.description}, ${data.image}, ${data.link}, ${JSON.stringify(data.keywords)})
    RETURNING *
  `;
  return mapProject(rows[0] as ProjectRow);
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  keywords?: string[];
}

export async function updateProject(
  id: string,
  updates: UpdateProjectData
): Promise<Project | null> {
  const sql = getSQL();
  const rows = await sql`
    UPDATE projects
    SET title = COALESCE(${updates.title ?? null}, title),
        description = COALESCE(${updates.description ?? null}, description),
        image = COALESCE(${updates.image ?? null}, image),
        link = COALESCE(${updates.link ?? null}, link),
        keywords = COALESCE(${updates.keywords ? JSON.stringify(updates.keywords) : null}::jsonb, keywords),
        updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  const row = rows[0] as ProjectRow | undefined;
  return row ? mapProject(row) : null;
}

export async function deleteProject(id: string): Promise<Project | null> {
  const sql = getSQL();
  const rows = await sql`DELETE FROM projects WHERE id = ${id} RETURNING *`;
  const row = rows[0] as ProjectRow | undefined;
  return row ? mapProject(row) : null;
}
