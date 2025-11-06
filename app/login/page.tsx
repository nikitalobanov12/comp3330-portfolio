import Navbar from "@/src/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-[family-name:var(--font-roboto-mono)]">
              Login
            </CardTitle>
            <CardDescription>
              Authentication placeholder page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This is a placeholder for the login functionality.
              You can integrate your preferred authentication method here.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full">
                Continue with GitHub
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Consider using NextAuth.js, Clerk, or similar services
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
