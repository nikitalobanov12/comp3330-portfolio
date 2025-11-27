import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotFoundProps {
  message?: string;
}

export default function NotFound({ message }: NotFoundProps) {
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
              Page Not Found
            </h2>
            <p className="text-muted-foreground">
              {message || "The page you're looking for doesn't exist or has been moved."}
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
