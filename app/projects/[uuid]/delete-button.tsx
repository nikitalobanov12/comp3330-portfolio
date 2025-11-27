"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteProjectButtonProps {
  id: string;
  title: string;
}

export default function DeleteProjectButton({
  id,
  title,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Project deleted successfully");
        router.push("/projects");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
