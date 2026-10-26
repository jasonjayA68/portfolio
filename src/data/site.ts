/**
 * Site-wide facts in one place.
 *
 * Any page or component that needs your name, email or WhatsApp number imports
 * it from here, so a change in this file updates the whole site.
 */
import { placeholders } from './placeholders'

export const site = {
  name: 'Jason Jay Ababao',
  firstName: 'Jason',
  role: 'AI Integration Developer',
  roleLong: 'AI Integration Developer for WordPress & Shopify',
  headline: 'Your website should answer customers and capture leads while you sleep.',
  tagline:
    "I'm Jason, an AI integration developer. I build AI assistants and lead automations into WordPress and Shopify sites, connected to HubSpot and GoHighLevel, for tour operators and online stores.",
  description:
    'I add AI assistants and lead automations to WordPress and Shopify sites, connected to HubSpot and GoHighLevel. 14 client sites, 5+ years. Available for projects.',
  location: 'Naawan, Misamis Oriental, PH',
  locationShort: 'Naawan, Philippines',
  email: 'jasonjay.ababao1968@gmail.com',
  whatsappNumber: '+63 967 429 8088',
  whatsappUrl: 'https://wa.me/639674298088',
  githubUrl: 'https://github.com/jasonjayA68',
  // Leave a URL as an empty string ('') to hide its icon on the Contact page.
  linkedinUrl: 'https://www.linkedin.com/in/jason-jay-ababao-a91841230/',
  facebookUrl: 'https://www.facebook.com/jjasoon/',
  // "Book a free 20-min call". Falls back to the contact page until a booking link is set.
  bookingUrl: placeholders.bookingUrl || '/contact',
  bookingMonth: placeholders.bookingMonth,
  // Hard-coded on purpose: reading the clock during rendering makes Next.js treat the page as dynamic.
  copyrightYear: 2026,
  // A stat with value null is hidden.
  stats: [
    { label: 'Live client sites', value: 14, suffix: '' },
    { label: 'Years building for clients', value: 5, suffix: '+' },
    { label: 'Countries served (AU, CA, IE)', value: 3, suffix: '' },
    { label: 'AI builds shipped', value: placeholders.aiBuildsShipped, suffix: '' },
  ] as { label: string; value: number | null; suffix: string }[],
}
