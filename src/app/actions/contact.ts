"use server";

import { z } from "zod";
import { sendBrevoEmail } from "@/lib/email";
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
    if (!env.BREVO_API_KEY) {
      throw new Error("Missing email service configuration.");
    }

    await sendBrevoEmail({
      subject: `New Contact Form Submission: ${subject}`,
      htmlContent: `
        <h1>New Contact Request</h1>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      to: [
        { email: "psiteregion3@gmail.com" },
        { email: "ajdalonzo.student@ua.edu.ph" }
      ],
    });

    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "An unexpected error occurred." 
    };
  }
}
