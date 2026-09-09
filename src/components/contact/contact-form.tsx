"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const [startedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      track({ name: "contact_form_submitted" });
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-6 text-sm"
      >
        <CheckCircle2 className="text-[var(--accent)]" size={20} />
        Thanks — your message has been sent. I&rsquo;ll get back to you soon.
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      {/* Honeypot — hidden from real users via CSS, visible to bots that don't render CSS */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-[var(--muted)]">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-invalid={!!state.fieldErrors?.name}
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-transparent px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
        />
        {state.fieldErrors?.name && (
          <p id="name-error" className="mt-1 text-xs text-red-400">
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-[var(--muted)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-invalid={!!state.fieldErrors?.email}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-transparent px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="mt-1 text-xs text-red-400">
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-[var(--muted)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-invalid={!!state.fieldErrors?.message}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
          className="w-full resize-none rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-transparent px-4 py-3 text-sm outline-none focus-visible:border-[var(--accent)]"
        />
        {state.fieldErrors?.message && (
          <p id="message-error" className="mt-1 text-xs text-red-400">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      {state.status === "error" && state.message && !state.fieldErrors && (
        <p role="alert" className="text-sm text-red-400">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full md:w-auto">
        {pending ? "Sending\u2026" : "Send message"}
      </Button>
    </form>
  );
}
