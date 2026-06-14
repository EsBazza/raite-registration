"use server";

import { z } from "zod";
import { resend } from "@/lib/email";
import { env } from "@/env";

// Define the form validation schema
const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

// Define a type for the action state
export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function sendContactEmail(
  prevState: ContactFormState | null,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, subject, message } = validatedFields.data;

  try {
    if (!env.RESEND_API_KEY) {
      throw new Error("Missing email service configuration.");
    }

    const emailResponse = await resend.emails.send({
      from: "PSITE Region 3 Contact <onboarding@resend.dev>",
      to: "psiteregion3@gmail.com",
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Request</h1>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(emailResponse.error.message || "Failed to send email via Resend.");
    }

    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unexpected error occurred." 
    };
  }
}
