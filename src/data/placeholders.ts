/**
 * EVERY value the site is still missing, in one place.
 *
 * Search this file for "TODO" and fill in the real values. While a value is
 * empty ('' / null / []), the page that uses it hides that piece instead of
 * showing a placeholder, so nothing half-finished appears on the live site.
 *
 * Never put made-up numbers, results or quotes here: only real ones.
 */

export type Quote = {
  text: string
  name: string
  role: string
  company: string
}

export const placeholders = {
  /** Homepage status pill: "Booking AI projects for <month>". e.g. 'December 2026' */
  bookingMonth: '', // TODO: add the month you're booking for

  /** "Book a free 20-min call" button. e.g. a Calendly or Cal.com link. Empty = button goes to /contact */
  bookingUrl: '', // TODO: add your booking link

  /** Homepage stat "AI builds shipped". null = stat hidden */
  aiBuildsShipped: null as number | null, // TODO: add real number

  /** "Starting at" price on each /services card. Empty = "Quoted after a free call" */
  prices: {
    'ai-website-assistant': '', // TODO: add real price, e.g. 'US$X setup + US$Y/mo'
    'ai-lead-automation': '', // TODO: add real price
    'ai-ready-website': '', // TODO: add real price
    'ai-care-plan': '', // TODO: add real price
  } as Record<string, string>,

  /** One-line result under each homepage "Selected work" card. Empty = hidden */
  projectResults: {
    'go-euro-tours': '', // TODO: add a real one-line result
    'go-irish-tours': '', // TODO: add a real one-line result
    'your-reformer': '', // TODO: add a real one-line result
  } as Record<string, string>,

  /** Case study pages (/projects/<slug>). Empty sections are hidden. */
  caseStudies: {
    'go-euro-tours': {
      problem: '', // TODO: what wasn't working before
      results: [] as string[], // TODO: real results, one per line
      quote: null as Quote | null, // TODO: real client quote
    },
    'go-irish-tours': {
      problem: '', // TODO
      results: [] as string[], // TODO
      quote: null as Quote | null, // TODO
    },
    'your-reformer': {
      problem: '', // TODO
      results: [] as string[], // TODO
      quote: null as Quote | null, // TODO
    },
  } as Record<string, { problem: string; results: string[]; quote: Quote | null }>,

  /** Homepage testimonials (2–3). Empty list = section hidden */
  testimonials: [] as Quote[], // TODO: add real testimonials

  /** One result for the DG Venture LTD entry on /experience. Empty = hidden */
  dgVentureResult: '', // TODO: add one real result

  /** Loom embed URLs for /lab cards, e.g. 'https://www.loom.com/embed/<id>'. Empty = no video */
  labVideos: {
    'portfolio-assistant': '', // TODO: optional Loom walkthrough
  } as Record<string, string>,
}
