import { sendBrevoEmail } from "./src/lib/email";

async function testEmail() {
  console.log("Sending test email...");
  try {
    await sendBrevoEmail({
      subject: "Brevo Test Email",
      htmlContent: "<h1>Brevo Integration Test</h1><p>If you are reading this, your Brevo integration is working correctly!</p>",
      to: [
        { email: "garciagamer432@gmail.com" },
        { email: "psiteregion3@gmail.com"},
        { email: "ajdalonzo@gmail.com"}
      ],
    });
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Test email failed:", error);
  }
}

testEmail();
