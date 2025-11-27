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
