/**
 * Site-wide facts in one place.
 *
 * Any page or component that needs your name, email or WhatsApp number imports
 * it from here, so a change in this file updates the whole site.
 */
export const site = {
  name: 'Jason Jay Ababao',
  firstName: 'Jason',
  role: 'Full-Stack Web Developer',
  tagline:
    'I design and build fast, polished websites for ambitious brands in e-commerce, travel, wellness and professional services — across WordPress, Shopify and Laravel.',
  description:
    'Jason Jay Ababao — full-stack web developer building fast, conversion-focused websites on WordPress, Shopify and Laravel.',
  location: 'Naawan, Misamis Oriental, PH',
  locationShort: 'Naawan, Philippines',
  email: 'jasonjay.ababao1968@gmail.com',
  whatsappNumber: '+63 967 429 8088',
  whatsappUrl: 'https://wa.me/639674298088',
  githubUrl: 'https://github.com/jasonjayA68',
  // Leave a URL as an empty string ('') to hide its icon on the Contact page.
  linkedinUrl: 'https://www.linkedin.com/in/jason-jay-ababao-a91841230/',
  facebookUrl: 'https://www.facebook.com/jjasoon/',
  // Hard-coded on purpose: reading the clock during rendering makes Next.js treat the page as dynamic.
  copyrightYear: 2026,
  stats: [
    { label: 'Live client sites', value: 14, suffix: '+' },
    { label: 'Years experience', value: 5, suffix: '+' },
    { label: 'Agencies', value: 4, suffix: '' },
  ],
}
