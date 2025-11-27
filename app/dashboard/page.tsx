import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth0.getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <section className="min-h-[60vh] flex flex-col items-center gap-6">
        <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-roboto-mono)]">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome, {session.user.email}
        </p>
        <div className="mt-8 p-6 border rounded-lg bg-card max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Name:</span>{" "}
              {session.user.name || "Not provided"}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              {session.user.email}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Future labs will let you edit the hero section and manage site content
          from here. For now, this serves as a protected dashboard placeholder.
        </p>
      </section>
    </main>
  );
}
