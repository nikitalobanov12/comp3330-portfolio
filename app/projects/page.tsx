import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createSlug } from "@/lib/utils";

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  keywords: string[];
}

export default async function ProjectsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`, {
    cache: "no-store",
  });
  const { projects } = (await res.json()) as { projects: Project[] };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 md:mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-[family-name:var(--font-roboto-mono)] mb-2">
            Projects
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Browse all my projects
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">Add New Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((p) => {
          const slug = createSlug(p.title);
          return (
            <Card
              key={slug}
              className="group hover:scale-105 transition-transform flex flex-col overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg sm:text-xl font-[family-name:var(--font-roboto-mono)]">
                  {p.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {p.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" variant="secondary">
                    <a href={p.link} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/projects/${slug}`}>Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
