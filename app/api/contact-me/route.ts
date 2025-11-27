import { NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactFormSchema = z.object({
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

export async function POST(req: NextRequest) {
  try {
    // Initialize Resend inside the handler to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = await req.json();

    // Server-side validation
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          ok: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "onboarding@resend.dev",
      to: process.env.RESEND_TO || "delivered@resend.dev",
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<h3>Message:</h3>
<p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { ok: false, message: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", data);

    return Response.json(
      { ok: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return Response.json(
      { ok: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export function GET() {
  return Response.json({ error: "Method Not Allowed" }, { status: 405 });
}
