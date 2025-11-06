import Navbar from "@/src/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-[family-name:var(--font-roboto-mono)]">
              Projects
            </CardTitle>
            <CardDescription className="text-lg">
              All my projects will be listed here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page is under construction. Check back soon to see my complete portfolio of projects!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
