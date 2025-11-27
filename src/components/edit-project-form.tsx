"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { projectSchema, type ProjectFormValues } from "@/lib/schemas";
import { Trash2 } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  keywords: string[];
}

interface EditProjectFormProps {
  project: Project;
  uuid: string;
}

export default function EditProjectForm({
  project,
  uuid,
}: EditProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(project.keywords);
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      image: project.image,
      link: project.link,
      keywords: project.keywords,
    },
  });

  function addKeyword() {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      const newKeywords = [...keywords, trimmed];
      setKeywords(newKeywords);
      form.setValue("keywords", newKeywords);
      setKeywordInput("");
    }
  }

  function removeKeyword(keyword: string) {
    const newKeywords = keywords.filter((k) => k !== keyword);
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords);
  }

  async function onSubmit(values: ProjectFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Project updated successfully");
        router.push(`/projects/${uuid}`);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${uuid}`, {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Project description"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Keywords</FormLabel>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add a keyword"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={addKeyword}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-auto"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
