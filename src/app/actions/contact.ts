"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address."),
  message: z.string().trim().min(10, "Message should be at least 10 characters.").max(4000),
  // Honeypot field \u2014 real users never fill this in; bots often do.
  company: z.string().max(0, "Spam detected.").optional().default(""),
  // Simple time-trap: form submitted faster than a human could type.
  startedAt: z.coerce.number().optional(),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company"),
    startedAt: formData.get("startedAt"),
  };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "name" | "email" | "message" | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the errors below.", fieldErrors };
  }

  const { startedAt } = parsed.data;
  if (startedAt && Date.now() - startedAt < 1500) {
    // Submitted implausibly fast \u2014 likely a bot. Fail silently as \"success\"
    // so we don't tip off the bot, without actually sending anything.
    return { status: "success" };
  }

  try {
    // TODO: wire up your actual delivery mechanism, e.g.:
    // - an email provider (Resend, Postmark, SES)
    // - a webhook to Slack/Notion
    // - a database insert
    // Never expose provider API keys to the client \u2014 this runs server-side only.
    // Example:
    // await resend.emails.send({ to: profile.email, subject: `New message from ${parsed.data.name}`, ... })

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[contact] new submission", parsed.data);
    }

    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Something went wrong sending your message. Please email me directly instead.",
    };
  }
}
