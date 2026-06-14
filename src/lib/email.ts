import { env } from "@/env";

export async function sendBrevoEmail({
  subject,
  htmlContent,
  to,
  sender = { name: "RAITE 2026", email: "noreply@raite.ph" },
}: {
  subject: string;
  htmlContent: string;
  to: { email: string }[];
  sender?: { name: string; email: string };
}) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      subject,
      htmlContent,
      sender,
      to,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Brevo API error: ${errorData.message || response.statusText}`);
  }

  return response.json();
}
