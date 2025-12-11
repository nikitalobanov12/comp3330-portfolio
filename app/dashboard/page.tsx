"use client";

import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import HeroEditorForm from "@/src/components/hero-editor-form";

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <section className="min-h-[60vh] flex flex-col items-center gap-6">
        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-roboto-mono)]">
          Dashboard
        </h1>

        {/* Loading state */}
        {isLoading && (
          <p className="text-muted-foreground text-lg">Loading...</p>
        )}

        {/* Not logged in */}
        {!isLoading && !user && (
          <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-lg text-muted-foreground text-center">
              Log in to update your portfolio content.
            </p>
            <Button asChild size="lg">
              <a href="/auth/login">Log In</a>
            </Button>
          </div>
        )}

        {/* Logged in - show dashboard content */}
        {!isLoading && user && (
          <div className="w-full max-w-5xl px-4 pb-10">
            <p className="mb-6 text-lg text-center text-muted-foreground">
              Welcome to your dashboard, {user.nickname || user.email}!
            </p>
            <HeroEditorForm />
          </div>
        )}
      </section>
    </main>
  );
}
