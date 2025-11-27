"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  keywords: string[];
}

export default function ProjectsPage() {
  const { user, isLoading: authLoading } = useUser();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Project deleted successfully");
        setProjects((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 md:mb-8 flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

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
        {user && (
          <Button asChild>
            <Link href="/projects/new">Add New Project</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((p) => (
          <Card
            key={p.id}
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
              <div className="flex gap-2 pt-2 flex-wrap">
                <Button asChild size="sm" variant="secondary">
                  <a href={p.link} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/projects/${p.id}`}>Details</Link>
                </Button>
                {user && !authLoading && (
                  <>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/projects/${p.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
