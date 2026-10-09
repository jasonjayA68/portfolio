/**
 * Every client project, as plain data.
 *
 * This one array feeds:
 *   - the home page        (featured projects)
 *   - /projects            (the filterable grid)
 *   - /projects/[slug]     (one detail page per project)
 *   - /api/projects        (a JSON endpoint)
 *   - the assistant and the command palette
 *
 * To add a project: copy one object, change the values, and drop a
 * screenshot into public/assets/projects/. Its page appears automatically.
 */

// A TypeScript "type" describes the shape every project must have.
// If you forget a field or misspell one, your editor shows an error.
export type Project = {
  slug: string // used in the URL: /projects/<slug>
  title: string
  url: string // the website's address
  offlineNote?: string // set when your version is no longer online; hides the "Live site" links
  image: string // path inside /public
  summary: string
  tags: string[] // shown as small labels on the card
  platforms: string[] // used by the filter chips
  industries: string[] // used by the filter chips
  keywords: string[] // extra words the assistant recognises
  featured: boolean // shown on the home page
  agency?: string // the "?" means this field is optional
}

export const projects: Project[] = [
  {
    slug: 'curakidney',
    title: 'CuraKidney',
    url: 'https://www.curakidney.com',
    image: '/assets/projects/curakidney.webp',
    summary:
      'PhilHealth-accredited dialysis clinic site for patients in Pasig and Marikina, with slot reservations, patient resources and Messenger and Viber contact — built on WordPress + Elementor.',
    tags: ['WordPress', 'Elementor', 'Healthcare'],
    platforms: ['wordpress', 'elementor'],
    industries: ['healthcare'],
    keywords: ['curakidney', 'cura', 'kidney', 'dialysis'],
    featured: true,
  },
  {
    slug: 'your-reformer',
    title: 'Your Reformer',
    url: 'https://yourreformer.com',
    image: '/assets/projects/yourreformer.webp',
    summary:
      'Premium Pilates reformer e-commerce store built on Shopify, featuring product configurators, subscriptions and integrated class booking.',
    tags: ['Shopify', 'E-commerce'],
    platforms: ['shopify'],
    industries: ['e-commerce', 'fitness'],
    keywords: ['reformer', 'pilates'],
    featured: true,
    agency: 'ESTRAT360',
  },
  {
    slug: 'ebike-generation',
    title: 'Ebike Generation',
    url: 'https://ebikegeneration.com',
    image: '/assets/projects/ebikegeneration.webp',
    summary:
      'High-performance e-bike storefront with custom product pages, financing integrations and a bold motion-driven brand experience.',
    tags: ['Shopify Liquid', 'E-commerce'],
    platforms: ['shopify'],
    industries: ['e-commerce'],
    keywords: ['ebike', 'e-bike', 'ebikes'],
    featured: true,
    agency: 'DG Venture LTD',
  },
  {
    slug: 'woven-panel',
    title: 'Woven Panel',
    url: 'https://wovenpanel.com.au',
    image: '/assets/projects/wovenpanel.webp',
    summary:
      'Australian architectural mesh brand site built on Shopify, with product ranges, a project gallery and CPD presentation requests for architects.',
    tags: ['Shopify', 'E-commerce'],
    platforms: ['shopify'],
    industries: ['e-commerce', 'architecture'],
    keywords: ['woven', 'wovenpanel'],
    featured: true,
    agency: 'ESTRAT360',
  },
  {
    slug: 'subtle-energies',
    title: 'Subtle Energies',
    url: 'https://subtleenergies.com.au',
    image: '/assets/projects/subtleenergies.webp',
    summary:
      'Established Ayurvedic aromatherapy brand site with wholesale portal, training course platform and global shipping built on Shopify.',
    tags: ['Shopify', 'Wellness'],
    platforms: ['shopify'],
    industries: ['wellness', 'e-commerce'],
    keywords: ['subtle', 'ayurvedic', 'aromatherapy'],
    featured: true,
    agency: 'DG Venture LTD',
  },
  {
    slug: 'go-euro-tours',
    title: 'Go Euro Tours',
    url: 'https://goeurotours.com',
    image: '/assets/projects/goeurotours.webp',
    summary:
      'Curated European tour operator site with destination pages, itinerary builder, lead capture and bookings — built on WordPress + Elementor.',
    tags: ['WordPress', 'Elementor', 'Travel'],
    platforms: ['wordpress', 'elementor'],
    industries: ['travel'],
    keywords: ['goeurotours'],
    featured: true,
    agency: 'DG Venture LTD',
  },
  {
    slug: 'toptier-virtuals',
    title: 'TopTier Virtuals',
    url: 'https://toptiervirtuals.com',
    image: '/assets/projects/toptiervirtuals.webp',
    summary:
      'Lead-generation site for a virtual assistant agency with funnels, CRM-integrated booking and conversion-optimized landing pages.',
    tags: ['WordPress', 'Lead gen'],
    platforms: ['wordpress'],
    industries: ['lead gen', 'services'],
    keywords: ['toptier'],
    featured: false,
    agency: 'ESTRAT360',
  },
  {
    slug: 'think-tank-tutors',
    title: 'Think Tank Tutors',
    url: 'https://thinktanktutors.com',
    image: '/assets/projects/thinktanktutors.webp',
    summary:
      'Online tutoring platform with subject-matched tutor booking, SAT prep funnels and parent dashboards built on WordPress.',
    tags: ['WordPress', 'Education'],
    platforms: ['wordpress'],
    industries: ['education'],
    keywords: ['thinktank'],
    featured: false,
    agency: 'ESTRAT360',
  },
  {
    slug: 'go-euro-golf',
    title: 'Go Euro Golf',
    url: 'https://goeurogolf.com',
    image: '/assets/projects/goeurogolf.webp',
    summary:
      'Luxury golf-tour operator site with course directories, package builders and an enquiry-to-booking flow for European destinations.',
    tags: ['Elementor', 'Travel'],
    platforms: ['wordpress', 'elementor'],
    industries: ['travel'],
    keywords: ['goeurogolf'],
    featured: false,
    agency: 'ESTRAT360',
  },
  {
    slug: 'go-irish-tours',
    title: 'Go Irish Tours',
    url: 'https://goirishtours.com',
    image: '/assets/projects/goirishtours.webp',
    summary:
      'Private Ireland tour company site with destination guides, custom itinerary requests and review integrations — built on Elementor.',
    tags: ['Elementor', 'Travel'],
    platforms: ['wordpress', 'elementor'],
    industries: ['travel'],
    keywords: ['goirishtours', 'irish'],
    featured: false,
    agency: 'ESTRAT360',
  },
  {
    slug: 'connect-ca',
    title: 'Connect.ca',
    url: 'https://connect.ca',
    image: '/assets/projects/connect-ca.webp',
    summary:
      'Toronto real-estate brokerage site with pre-construction listings, VIP access sign-ups and buyer and seller lead funnels.',
    tags: ['Laravel', 'Real estate'],
    platforms: ['laravel'],
    industries: ['real estate', 'property'],
    keywords: ['connect.ca', 'toronto'],
    featured: false,
    agency: 'ESTRAT360',
  },
  {
    slug: 'sunshine-coast-rentals',
    title: 'Sunshine Coast Rentals',
    url: 'https://sunshinecoastpropertyrentals.com',
    offlineNote: 'The business has since rebranded as Rosel Living, so this version of the site is no longer online.',
    image: '/assets/projects/sunshinecoast.webp',
    summary:
      "Holiday rental site for Queensland's Sunshine Coast with availability search, property listings and integrated booking management.",
    tags: ['WordPress', 'Property'],
    platforms: ['wordpress'],
    industries: ['property', 'real estate'],
    keywords: ['sunshine', 'queensland', 'rosel'],
    featured: false,
    agency: 'DG Venture LTD',
  },
  {
    slug: 'dream-trips-ireland',
    title: 'Dream Trips Ireland',
    url: 'https://dreamtripsireland.com',
    image: '/assets/projects/dreamtripsireland.webp',
    summary:
      'Bespoke Ireland travel planner site with self-drive and guided itineraries, lead capture and a story-rich destination experience.',
    tags: ['WordPress', 'Travel'],
    platforms: ['wordpress'],
    industries: ['travel'],
    keywords: ['dreamtripsireland'],
    featured: false,
    agency: 'DG Venture LTD',
  },
  {
    slug: 'dream-trips-scotland',
    title: 'Dream Trips Scotland',
    url: 'https://dreamtripsscotland.com',
    image: '/assets/projects/dreamtripsscotland.webp',
    summary:
      'Scotland travel brand site featuring Highland tours, castle itineraries and whisky-trail packages with dramatic visual storytelling.',
    tags: ['WordPress', 'Travel'],
    platforms: ['wordpress'],
    industries: ['travel'],
    keywords: ['dreamtripsscotland', 'scotland', 'highland', 'whisky'],
    featured: false,
    agency: 'DG Venture LTD',
  },
]

/** The filter chips on /projects. `value` is what appears in the URL: /projects?filter=shopify */
export const projectFilters = [
  { value: 'all', label: 'All' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'travel', label: 'Travel' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'property', label: 'Property' },
]

/* ---------- Small helper functions ("selectors") ---------- */

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured)
}

/** Does this project match a filter value such as "shopify" or "travel"? */
export function matchesFilter(project: Project, filter: string) {
  if (filter === 'all') return true
  return project.platforms.includes(filter) || project.industries.includes(filter)
}

export function getProjectsByFilter(filter: string) {
  return projects.filter((project) => matchesFilter(project, filter))
}

/** "https://www.curakidney.com/" -> "curakidney.com" */
export function displayDomain(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}
