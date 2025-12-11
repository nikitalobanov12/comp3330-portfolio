import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name is too long" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message is too long" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Project schemas
export const projectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
  link: z.string().url({ message: "Please enter a valid project URL" }),
  keywords: z.array(z.string()),
});

export const projectUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().url().optional(),
  link: z.string().url().optional(),
  keywords: z.array(z.string()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
export type ProjectUpdateValues = z.infer<typeof projectUpdateSchema>;

// Hero schemas
export const heroSchema = z.object({
  avatar: z
    .string()
    .trim()
    .min(1, { message: "Avatar is required" })
    .refine((v) => v.startsWith("data:"), {
      message: "Avatar must be a data URL",
    }),
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(200, { message: "Name is too long" }),
  shortDescription: z
    .string()
    .trim()
    .min(2, { message: "Short description must be at least 2 characters" })
    .max(120, { message: "Short description must be at most 120 characters" }),
  longDescription: z
    .string()
    .trim()
    .min(10, { message: "Long description must be at least 10 characters" })
    .max(5000, { message: "Long description is too long" }),
});

// Client-side form schema (avatar can be empty initially, will be validated before submit)
export const heroFormSchema = z.object({
  avatar: z.string().min(1, { message: "Avatar is required" }),
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(200, { message: "Name is too long" }),
  shortDescription: z
    .string()
    .min(2, { message: "Short description must be at least 2 characters" })
    .max(120, { message: "Short description must be at most 120 characters" }),
  longDescription: z
    .string()
    .min(10, { message: "Long description must be at least 10 characters" })
    .max(5000, { message: "Long description is too long" }),
});

export type HeroFormValues = z.infer<typeof heroSchema>;
export type HeroFormClientValues = z.infer<typeof heroFormSchema>;
