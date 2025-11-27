import { NextResponse } from "next/server";
import { fetchProjects, ensureProjectsTable, seedProjectsTable } from "@/lib/db";

// Seed data for initial database population
const seedData = [
  {
    title: "Conway's Game of Life",
    description:
      "Cellular automaton visualizer that simulates Conway's Game of Life with interactive controls and customizable grid sizes.",
    image: "https://placehold.co/300x300.png",
    link: "https://example.com/game-of-life",
    keywords: ["algorithms", "simulation", "javascript"],
  },
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with payment integration, inventory management, and real-time analytics.",
    image: "https://placehold.co/300x300.png",
    link: "https://example.com/ecommerce",
    keywords: ["react", "node.js", "stripe", "postgresql"],
  },
  {
    title: "Task Management App",
    description:
      "Collaborative project management tool with real-time updates, team chat, and kanban boards.",
    image: "https://placehold.co/300x300.png",
    link: "https://example.com/task-manager",
    keywords: ["typescript", "next.js", "prisma"],
  },
  {
    title: "Weather Dashboard",
    description:
      "Real-time weather tracking with interactive maps, forecasts, and customizable alerts for multiple locations.",
    image: "https://placehold.co/300x300.png",
    link: "https://example.com/weather",
    keywords: ["api", "react", "charts"],
  },
];

// GET /api/projects - List all projects
export async function GET() {
  try {
    // Ensure table exists and seed if empty
    await ensureProjectsTable();
    
    let projects = await fetchProjects();
    
    // Seed if database is empty
    if (projects.length === 0) {
      await seedProjectsTable(seedData);
      projects = await fetchProjects();
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Failed to fetch projects", error: String(error) },
      { status: 500 }
    );
  }
}
