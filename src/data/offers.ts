/**
 * What I sell, as plain data.
 *
 * Feeds the home page ("What I build", "How it works"), /services and the assistant,
 * so the chat always answers with the same offers and prices as the pages.
 * Prices live in placeholders.ts until real ones are added.
 */
import type { IconName } from '@/components/ui/Icon'
import { placeholders } from './placeholders'

export type Offer = {
  slug: string
  name: string
  icon: IconName
  forWho: string
  includes: string[]
  timeline: string
  pricingModel: string // how it's billed
  startingAt: string // '' until a real price is added
  flagship?: boolean
  keywords: string[] // words the assistant recognises for this offer
}

export const offers: Offer[] = [
  {
    slug: 'ai-website-assistant',
    name: 'AI Website Assistant',
    icon: 'spark',
    forWho: 'Tour operators, clinics, service businesses',
    includes: [
      'Chat assistant trained on your pages and PDFs',
      'Cites its sources',
      'Collects trip or booking details',
      'Hands off to a human',
      'Sends leads to your CRM',
      'Monthly report of top questions',
    ],
    timeline: '2–3 weeks',
    pricingModel: 'Setup fee + monthly',
    startingAt: placeholders.prices['ai-website-assistant'],
    flagship: true,
    keywords: ['chatbot', 'chat bot', 'assistant', 'ai assistant', 'add a chatbot', 'ai chatbot', 'chat', 'answer questions', 'customer questions', 'rag'],
  },
  {
    slug: 'ai-lead-automation',
    name: 'AI Lead Automation',
    icon: 'bolt',
    forWho: 'Anyone using HubSpot or GoHighLevel',
    includes: [
      'Forms, bookings and emails into the CRM',
      'AI summary and lead score',
      'Instant personalized follow-up drafted for approval',
      'Slack or email alerts',
    ],
    timeline: '1–2 weeks',
    pricingModel: 'Fixed project fee',
    startingAt: placeholders.prices['ai-lead-automation'],
    keywords: ['automation', 'automate', 'n8n', 'hubspot', 'gohighlevel', 'go high level', 'ghl', 'crm', 'lead', 'leads', 'follow-up', 'follow up', 'lead scoring', 'pipeline', 'zapier'],
  },
  {
    slug: 'ai-ready-website',
    name: 'AI-Ready Website Build',
    icon: 'layout',
    forWho: 'New sites or rebuilds',
    includes: [
      'WordPress or Shopify build, fast and SEO-ready',
      'Structured content AI tools can read',
      'Assistant-ready from launch',
    ],
    timeline: '4–8 weeks',
    pricingModel: 'Fixed project fee',
    startingAt: placeholders.prices['ai-ready-website'],
    keywords: ['new website', 'new site', 'rebuild', 'redesign', 'build a site', 'build a website', 'website build', 'build me'],
  },
  {
    slug: 'ai-care-plan',
    name: 'AI Care Plan',
    icon: 'tool',
    forWho: 'Existing clients',
    includes: [
      'Updates, backups and security',
      'Speed checks',
      'Assistant tuning',
      'Monthly AI insights report',
    ],
    timeline: 'Ongoing',
    pricingModel: 'Monthly',
    startingAt: placeholders.prices['ai-care-plan'],
    keywords: ['maintenance', 'care plan', 'support', 'updates', 'backups', 'security', 'monthly plan'],
  },
]

/** Shown wherever a price would go while startingAt is empty */
export const priceFallback = 'Quoted after a free call'

/** The free entry offer, shown under the cards on /services */
export const auditOffer = {
  title: 'Free AI Site Audit',
  text: "Send your URL. I'll show you which customer questions your site can't answer and where leads are leaking.",
  href: '/contact',
  cta: 'Get my free audit',
}

/** The three cards in "What I build" on the home page */
export const buildCards: { title: string; text: string; icon: IconName }[] = [
  {
    title: 'AI website assistant',
    text: 'Answers questions from your own pages, tours and products, then hands warm leads to your team.',
    icon: 'spark',
  },
  {
    title: 'Lead automation',
    text: 'Every form, booking and chat goes into your CRM, gets summarized and scored by AI, and gets a fast follow-up.',
    icon: 'bolt',
  },
  {
    title: 'AI-ready websites',
    text: 'Fast, SEO-friendly WordPress and Shopify builds designed to plug into AI from day one.',
    icon: 'layout',
  },
]

/** "How it works" on the home page */
export const howItWorks = [
  { title: 'Free call', text: 'We talk through your site, your customers and where leads get stuck.' },
  { title: 'Fixed-price proposal', text: 'You get a written scope, timeline and price before any work starts.' },
  { title: 'Build and test', text: 'I build it and test it with your real customer questions before launch.' },
  { title: 'Launch, then monthly tuning', text: 'We go live, then I review what customers ask and keep improving the answers.' },
]

export type Faq = {
  question: string
  answer: string
  keywords: string[] // words the assistant recognises for this question
}

export const faqs: Faq[] = [
  {
    question: 'Will the AI make things up?',
    answer:
      'It answers only from your content, shows its sources, and says "I\'ll connect you with the team" when it isn\'t sure. I test it on your real questions before launch.',
    keywords: ['make things up', 'make up', 'hallucinate', 'hallucination', 'hallucinations', 'wrong answers', 'accurate', 'accuracy', 'reliable'],
  },
  {
    question: 'Do I need a new website?',
    answer: 'No. It plugs into your current WordPress or Shopify site.',
    keywords: ['need a new website', 'need a new site', 'current site', 'existing site', 'my current website', 'plug into'],
  },
  {
    question: 'What about customer data?',
    answer: 'Leads go to your own CRM. Nothing is used to train public AI models.',
    keywords: ['customer data', 'data', 'privacy', 'gdpr', 'private', 'secure', 'train'],
  },
  {
    question: 'What are the monthly costs?',
    answer:
      "My monthly fee plus AI usage, which for most small businesses is low. I'll estimate it in your proposal.",
    keywords: ['monthly cost', 'monthly costs', 'monthly fee', 'running cost', 'running costs', 'ai usage', 'per month', 'ongoing cost'],
  },
]
