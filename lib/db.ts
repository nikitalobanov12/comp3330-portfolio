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

// ============================================================================
// Hero Table Helpers (single-row design)
// ============================================================================

const HERO_PLACEHOLDER_AVATAR =
  "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const defaultHeroContent = {
  avatar: HERO_PLACEHOLDER_AVATAR,
  fullName: "Your Name",
  shortDescription: "Your professional title or tagline",
  longDescription:
    "Add a longer description about yourself, your skills, and what you do. This will appear on your portfolio homepage.",
};

// Export defaults via async function (required by "use server")
export async function getHeroDefaults(): Promise<{
  avatar: string;
  fullName: string;
  shortDescription: string;
  longDescription: string;
}> {
  return defaultHeroContent;
}

export async function getHeroPlaceholderAvatar(): Promise<string> {
  return HERO_PLACEHOLDER_AVATAR;
}

export interface Hero {
  id: string;
  avatar: string;
  fullName: string;
  shortDescription: string;
  longDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HeroRow {
  id: string;
  avatar: string;
  full_name: string;
  short_description: string;
  long_description: string;
  created_at: Date;
  updated_at: Date;
}

function mapHeroRow(row: HeroRow): Hero {
  return {
    id: row.id,
    avatar: row.avatar || defaultHeroContent.avatar,
    fullName: row.full_name || defaultHeroContent.fullName,
    shortDescription: row.short_description || defaultHeroContent.shortDescription,
    longDescription: row.long_description || defaultHeroContent.longDescription,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function ensureHeroTable(): Promise<void> {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS hero (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      avatar text NOT NULL DEFAULT '',
      full_name text NOT NULL,
      short_description text NOT NULL CHECK (char_length(short_description) <= 120),
      long_description text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  // Seed with default row if empty
  const result = await sql`SELECT COUNT(*)::int AS count FROM hero`;
  const count = Number(result[0]?.count ?? 0);
  if (count === 0) {
    await seedHeroTable();
  }
}

async function seedHeroTable(): Promise<void> {
  const sql = getSQL();
  await sql`
    INSERT INTO hero (avatar, full_name, short_description, long_description)
    VALUES (
      ${defaultHeroContent.avatar},
      ${defaultHeroContent.fullName},
      ${defaultHeroContent.shortDescription},
      ${defaultHeroContent.longDescription}
    )
  `;
}

export async function getHero(): Promise<Hero | null> {
  await ensureHeroTable();
  const sql = getSQL();
  const rows = await sql`
    SELECT id, avatar, full_name, short_description, long_description,
           created_at, updated_at
    FROM hero
    ORDER BY created_at ASC
    LIMIT 1
  `;
  const row = rows[0] as HeroRow | undefined;
  return row ? mapHeroRow(row) : null;
}

export interface UpsertHeroData {
  avatar?: string;
  fullName?: string;
  shortDescription?: string;
  longDescription?: string;
}

export async function upsertHero(updates: UpsertHeroData = {}): Promise<Hero> {
  await ensureHeroTable();
  const sql = getSQL();

  // Get current hero or use defaults
  const current = await getHero();

  // Merge: defaults → current → updates
  const merged = {
    avatar: updates.avatar ?? current?.avatar ?? defaultHeroContent.avatar,
    fullName: updates.fullName ?? current?.fullName ?? defaultHeroContent.fullName,
    shortDescription:
      updates.shortDescription ??
      current?.shortDescription ??
      defaultHeroContent.shortDescription,
    longDescription:
      updates.longDescription ??
      current?.longDescription ??
      defaultHeroContent.longDescription,
  };

  // Normalize avatar - use placeholder if empty
  if (!merged.avatar || merged.avatar.trim() === "") {
    merged.avatar = defaultHeroContent.avatar;
  }

  // Truncate short description if too long
  if (merged.shortDescription.length > 120) {
    merged.shortDescription = merged.shortDescription.slice(0, 120);
  }

  let rows: unknown[];

  if (current) {
    // UPDATE existing row
    rows = await sql`
      UPDATE hero
      SET avatar = ${merged.avatar},
          full_name = ${merged.fullName},
          short_description = ${merged.shortDescription},
          long_description = ${merged.longDescription},
          updated_at = now()
      WHERE id = ${current.id}
      RETURNING *
    `;
  } else {
    // INSERT new row
    rows = await sql`
      INSERT INTO hero (avatar, full_name, short_description, long_description)
      VALUES (${merged.avatar}, ${merged.fullName}, ${merged.shortDescription}, ${merged.longDescription})
      RETURNING *
    `;
  }

  return mapHeroRow(rows[0] as HeroRow);
}
