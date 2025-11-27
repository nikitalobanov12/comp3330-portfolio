import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth0 } from "@/lib/auth0";
import { getProjectById } from "@/lib/db";
import DeleteProjectButton from "./delete-button";

interface ProjectDetailPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { uuid } = await params;
  const session = await auth0.getSession();

  const project = await getProjectById(uuid);

  if (!project) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/projects">Back to Projects</Link>
        </Button>
        {session?.user && (
          <div className="flex gap-2">
            <Button asChild size="sm">
              <Link href={`/projects/${uuid}/edit`}>Edit Project</Link>
            </Button>
            <DeleteProjectButton id={uuid} title={project.title} />
          </div>
        )}
      </div>

      <Card className="max-w-4xl mx-auto overflow-hidden">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-[family-name:var(--font-roboto-mono)]">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-base sm:text-lg text-muted-foreground">
            {project.description}
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {project.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="bg-stone-600 text-stone-200"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild size="lg">
              <a href={project.link} target="_blank" rel="noreferrer">
                Visit Project
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">Back to All Projects</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
