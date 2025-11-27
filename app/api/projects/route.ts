// GET /api/projects
export async function GET() {
  const projects = [
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

  return Response.json({ projects });
}
