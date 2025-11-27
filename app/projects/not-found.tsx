"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectNotFound() {
  const params = useParams();
  const uuid = params?.uuid as string | undefined;

  return (
    <main className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-muted-foreground">
            404
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold font-[family-name:var(--font-roboto-mono)]">
              Project Not Found
            </h2>
            <p className="text-muted-foreground">
              {uuid ? (
                <>
                  The project with ID <span className="font-semibold font-mono text-sm">&quot;{uuid}&quot;</span> doesn&apos;t exist or has been removed.
                </>
              ) : (
                "The project you're looking for doesn't exist or has been removed."
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/projects">View All Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
