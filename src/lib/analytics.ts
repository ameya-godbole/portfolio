/**
 * ANALYTICS ABSTRACTION
 * -----------------------------------------------------------------------
 * A thin, provider-agnostic wrapper so you can swap analytics providers
 * (Vercel Analytics, Plausible, PostHog, etc.) without touching call
 * sites. Currently a no-op console log in development; wire up a real
 * provider inside `dispatch()`.
 * -----------------------------------------------------------------------
 */

export type AnalyticsEvent =
  | { name: "project_viewed"; slug: string }
  | { name: "project_video_played"; slug: string }
  | { name: "resume_downloaded" }
  | { name: "contact_form_submitted" }
  | { name: "external_link_clicked"; href: string };

function dispatch(event: AnalyticsEvent) {
  // Replace this with your provider of choice, e.g.:
  // window.plausible?.(event.name, { props: event });
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event);
  }
}

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  dispatch(event);
}
