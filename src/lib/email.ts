import * as brevo from "@getbrevo/brevo";
import { env } from "@/env";

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, env.BREVO_API_KEY || "");

export { apiInstance as brevoClient };
