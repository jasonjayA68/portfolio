/**
 * The three projects shown as full case studies.
 *
 * "What I built" comes from each project's existing description in projects.ts.
 * Problem, results and quote come from placeholders.ts and stay hidden until filled in.
 */
import { placeholders, type Quote } from './placeholders'

export type CaseStudy = {
  slug: string // matches a project in projects.ts
  goal: string
  built: string[]
  problem: string
  results: string[]
  quote: Quote | null
  aiUpgrade: string
}

const extras = (slug: string) => placeholders.caseStudies[slug]

export const caseStudies: CaseStudy[] = [
  {
    slug: 'go-euro-tours',
    goal: 'A curated European tour operator that needed a site to present its destinations and capture tour enquiries and bookings.',
    built: [
      'Destination pages',
      'Itinerary builder',
      'Lead capture and booking flow',
      'Built on WordPress + Elementor',
    ],
    ...extras('go-euro-tours'),
    aiUpgrade:
      "How I'd add AI today: an assistant trained on every itinerary page to answer questions like 'Which tour fits 10 days in Italy with kids?' and pass the lead to sales.",
  },
  {
    slug: 'go-irish-tours',
    goal: 'A private Ireland tour company that needed a site to guide travellers and collect custom itinerary requests.',
    built: [
      'Destination guides',
      'Custom itinerary request flow',
      'Review integrations',
      'Built on Elementor',
    ],
    ...extras('go-irish-tours'),
    aiUpgrade:
      "How I'd add AI today: AI that turns a free-text itinerary request into a structured brief (dates, group, interests, budget) for the trip planner.",
  },
  {
    slug: 'your-reformer',
    goal: 'A premium Pilates reformer brand that needed an online store to sell equipment and book classes.',
    built: [
      'Shopify e-commerce store',
      'Product configurators',
      'Subscriptions',
      'Integrated class booking',
    ],
    ...extras('your-reformer'),
    aiUpgrade:
      "How I'd add AI today: a product advisor that recommends the right reformer from space, budget and experience level.",
  },
]

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug)
}
