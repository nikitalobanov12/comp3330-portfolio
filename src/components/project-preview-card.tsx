import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  title: string;
  description: string;
  color: string;
  link: string;
}

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with payment integration, inventory management, and real-time analytics.",
    color: "bg-indigo-500",
    link: "/projects/ecommerce",
  },
  {
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates, team chat, and kanban boards.",
    color: "bg-violet-500",
    link: "/projects/task-manager",
  },
  {
    title: "AI Chat Assistant",
    description: "Intelligent chatbot powered by machine learning, providing context-aware responses and natural conversations.",
    color: "bg-pink-500",
    link: "/projects/ai-chat",
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather tracking with interactive maps, forecasts, and customizable alerts for multiple locations.",
    color: "bg-emerald-500",
    link: "/projects/weather",
  },
];

interface ProjectPreviewCardProps {
  count?: number;
}

export default function ProjectPreviewCard({ count = 3 }: ProjectPreviewCardProps) {
  const displayedProjects = projects.slice(0, count);

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[family-name:var(--font-roboto-mono)] mb-2">
          Featured Projects
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg">
          Check out some of my recent work
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {displayedProjects.map((project) => (
          <Card key={project.title} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`relative h-40 sm:h-48 w-full ${project.color} flex items-center justify-center transition-transform hover:scale-105`}>
              <p className="text-white font-bold text-lg sm:text-xl text-center px-4">
                {project.title}
              </p>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl font-[family-name:var(--font-roboto-mono)]">
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pb-4">
              <CardDescription className="text-sm sm:text-base">
                {project.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full">
                <Link href={project.link}>View Project</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {count < projects.length && (
        <div className="mt-8 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/projects">View All Projects</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
