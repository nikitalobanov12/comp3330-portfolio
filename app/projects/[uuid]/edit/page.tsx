import { notFound } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getProjectById } from "@/lib/db";
import EditProjectForm from "@/src/components/edit-project-form";

interface EditProjectPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { uuid } = await params;
  const session = await auth0.getSession();

  // This should already be protected by middleware, but double-check
  if (!session?.user) {
    notFound();
  }

  const project = await getProjectById(uuid);

  if (!project) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-roboto-mono)] mb-6">
          Edit Project
        </h1>
        <EditProjectForm project={project} uuid={uuid} />
      </div>
    </main>
  );
}
