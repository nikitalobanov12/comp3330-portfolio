"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const newProjectSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Your title is too short" })
    .max(200, { message: "Your title is too long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description is too long" }),
  img: z.string().url({ message: "Please enter a valid URL" }),
  link: z.string().url({ message: "Please enter a valid URL" }),
  keywords: z.array(z.string()),
});

type NewProjectFormValues = z.infer<typeof newProjectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [draftKeyword, setDraftKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewProjectFormValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      img: "https://placehold.co/300.png",
      link: "",
      keywords: [],
    },
  });

  async function onSubmit(values: NewProjectFormValues) {
    setIsSubmitting(true);

    const loadingToast = toast.loading("Creating project...");

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("img", values.img);
    formData.append("link", values.link);
    formData.append("keywords", JSON.stringify(values.keywords));

    try {
      const response = await fetch("/api/projects/new", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ok) {
        toast.success("Project received successfully", {
          id: loadingToast,
          description: "Your project has been created.",
        });
        router.push("/projects");
      } else {
        toast.error("Failed to create project", {
          id: loadingToast,
          description: data.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create project", {
        id: loadingToast,
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-[family-name:var(--font-roboto-mono)]">
            Create New Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A title of your project"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the title of your project.
                    </FormDescription>
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
                      <Input
                        placeholder="A brief description of your project"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is a brief description of your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="img"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-image-link.com/image.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the image URL of your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-project-link.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the link to your project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => {
                  const currentKeywords = field.value ?? [];

                  const handleAddKeyword = () => {
                    const value = draftKeyword.trim();
                    if (!value || currentKeywords.includes(value)) return;

                    const updated = [...currentKeywords, value];
                    field.onChange(updated);
                    setDraftKeyword("");
                  };

                  const handleRemoveKeyword = (keyword: string) => {
                    const updated = currentKeywords.filter((k) => k !== keyword);
                    field.onChange(updated);
                  };

                  const handleKeyDown = (
                    event: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddKeyword();
                    }
                  };

                  return (
                    <FormItem>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                          <FormLabel>Keywords</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                value={draftKeyword}
                                onChange={(e) => setDraftKeyword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add a keyword and press Enter"
                              />
                              <Button type="button" onClick={handleAddKeyword}>
                                Add
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Tag your project so it is easier to filter later.
                          </FormDescription>
                        </div>
                        <div className="flex flex-1 flex-wrap gap-2 pt-0 sm:pt-6">
                          {currentKeywords.map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="outline"
                              className="flex items-center gap-1 bg-stone-600 text-stone-200"
                            >
                              {keyword}
                              <button
                                type="button"
                                className="ml-1 text-xs hover:text-red-300"
                                onClick={() => handleRemoveKeyword(keyword)}
                                aria-label={`Remove ${keyword}`}
                              >
                                x
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
