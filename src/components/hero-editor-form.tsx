"use client";

import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Upload, User } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { heroFormSchema, type HeroFormClientValues } from "@/lib/schemas";

const PLACEHOLDER_AVATAR = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

interface HeroData {
  id: string;
  avatar: string;
  fullName: string;
  shortDescription: string;
  longDescription: string;
}

export default function HeroEditorForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(PLACEHOLDER_AVATAR);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<HeroFormClientValues>({
    resolver: zodResolver(heroFormSchema),
    defaultValues: {
      avatar: PLACEHOLDER_AVATAR,
      fullName: "",
      shortDescription: "",
      longDescription: "",
    },
  });

  // Fetch current hero data on mount
  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await fetch("/api/hero");
        if (!response.ok) {
          throw new Error("Failed to fetch hero data");
        }
        const { data } = await response.json();
        if (data) {
          const heroData = data as HeroData;
          form.reset({
            avatar: heroData.avatar || PLACEHOLDER_AVATAR,
            fullName: heroData.fullName || "",
            shortDescription: heroData.shortDescription || "",
            longDescription: heroData.longDescription || "",
          });
          setAvatarPreview(heroData.avatar || PLACEHOLDER_AVATAR);
        }
      } catch (error) {
        console.error("Error fetching hero:", error);
        toast.error("Failed to load hero data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchHero();
  }, [form]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast.error("Image must be smaller than 1MB");
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAvatarPreview(dataUrl);
      form.setValue("avatar", dataUrl, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  async function onSubmit(values: HeroFormClientValues) {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Saving hero section...");

    try {
      const formData = new FormData();
      formData.append("avatar", values.avatar);
      formData.append("fullName", values.fullName);
      formData.append("shortDescription", values.shortDescription);
      formData.append("longDescription", values.longDescription);

      // Append file if a new one was selected
      if (avatarFile) {
        formData.append("avatarFile", avatarFile);
      }

      const response = await fetch("/api/hero", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update hero");
      }

      const { data } = await response.json();

      // Reset form with returned data
      form.reset({
        avatar: data.avatar,
        fullName: data.fullName,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
      });
      setAvatarPreview(data.avatar);
      setAvatarFile(null);

      toast.success("Hero section updated!", { id: loadingToast });
    } catch (error) {
      console.error("Error updating hero:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update hero",
        { id: loadingToast }
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const shortDescLength = form.watch("shortDescription")?.length || 0;

  if (isLoading) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-[family-name:var(--font-roboto-mono)]">
            Hero Section Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading hero data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-[family-name:var(--font-roboto-mono)]">
          Hero Section Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload Section */}
            <FormField
              control={form.control}
              name="avatar"
              render={() => (
                <FormItem>
                  <FormLabel>Profile Photo</FormLabel>
                  <div className="flex items-center gap-6">
                    {/* Avatar Preview */}
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-muted bg-muted flex items-center justify-center">
                      {avatarPreview && avatarPreview !== PLACEHOLDER_AVATAR ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <FormDescription>
                        JPG, PNG, GIF or WebP. Max 1MB.
                      </FormDescription>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Short Description */}
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Full-Stack Developer"
                      maxLength={120}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormDescription>
                      A brief tagline or title (shown below your name)
                    </FormDescription>
                    <span
                      className={`text-xs ${
                        shortDescLength > 110
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {shortDescLength}/120
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Long Description */}
            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Me *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a longer description about yourself, your skills, experience, and what you're passionate about..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the main bio text that appears on your homepage hero
                    section.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !form.formState.isDirty}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
