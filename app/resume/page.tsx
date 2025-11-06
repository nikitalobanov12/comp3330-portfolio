import Navbar from "@/src/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-[family-name:var(--font-roboto-mono)]">
              Resume
            </CardTitle>
            <CardDescription className="text-lg">
              Download my professional resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              My resume contains detailed information about my work experience, education, skills, and accomplishments.
            </p>
            <Button size="lg" className="w-full sm:w-auto">
              <Download className="mr-2 h-5 w-5" />
              Download Resume (PDF)
            </Button>
            <p className="text-sm text-muted-foreground">
              Note: Add your resume PDF to the /public folder and link it here.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
