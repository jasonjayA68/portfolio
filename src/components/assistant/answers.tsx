/**
 * The assistant's "brain" — no AI, just keyword matching.
 *
 * getAnswer("can you add a chatbot to my site?")
 *   1. Did the question name a project?   -> describe that project
 *   2. Otherwise score every intent by how many of its words appear
 *   3. Return the reply of the best-scoring intent (or a fallback)
 *
 * House rules for every reply (the "system prompt" of this scripted assistant):
 *   - Answer only from the site's own data; if unsure, say so and offer to connect with Jason.
 *   - Under 80 words, friendly and specific.
 *   - When a visitor describes a need, suggest the matching service and ask for their URL and email.
 *   - Never quote final prices: give the "starting at" price and say Jason confirms after a call.
 *
 * Services, FAQ, demos, case studies, skills and experience are read from src/data,
 * so the chat always says the same thing as the pages.
 *
 * Replies are JSX instead of HTML strings, so links can be real Next.js
 * <Link>s and React escapes everything the visitor types.
 */
import type { ReactNode } from 'react'
import { projects, type Project } from '@/data/projects'
import { experience } from '@/data/experience'
import { offers, faqs, howItWorks, priceFallback, type Offer } from '@/data/offers'
import { labDemos } from '@/data/lab'
import { getCaseStudy } from '@/data/caseStudies'
import { skillGroups } from '@/data/skills'
import { site } from '@/data/site'
import { ChatLink } from './ChatLink'

/* ---------- Small building blocks used by the replies ---------- */

function ProjectList({ list }: { list: Project[] }) {
  return (
    <ul>
      {list.map((project) => (
        <li key={project.slug}>
          <ChatLink href={`/projects/${project.slug}`}>{project.title}</ChatLink>
        </li>
      ))}
    </ul>
  )
}

function ContactLine() {
  return (
    <p>
      Reach {site.firstName} on{' '}
      <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>{' '}
      or <a href={`mailto:${site.email}`}>email</a> — or use the{' '}
      <ChatLink href="/contact">contact form</ChatLink>.
    </p>
  )
}

/** The ask that ends every "I have a need" reply */
function DemoAsk() {
  return (
    <p>
      Share your website URL and email through the <ChatLink href="/contact">contact form</ChatLink> and{' '}
      {site.firstName} will send you a free AI demo.
    </p>
  )
}

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1)

const priceText = (offer: Offer) =>
  offer.startingAt ? `Starting at ${offer.startingAt}` : `Starting price: ${priceFallback.toLowerCase()}`

function OfferReply({ offer }: { offer: Offer }) {
  return (
    <>
      <p>
        That&apos;s the <strong>{offer.name}</strong> ({offer.timeline}): {offer.includes.slice(0, 3).map(lowerFirst).join(', ')}.
      </p>
      <p>
        {priceText(offer)} ({offer.pricingModel.toLowerCase()}). {site.firstName} confirms the final price after a
        call. <ChatLink href="/services">All services →</ChatLink>
      </p>
      <DemoAsk />
    </>
  )
}

const byPlatform = (key: string) => projects.filter((p) => p.platforms.includes(key))
const byIndustry = (key: string) => projects.filter((p) => p.industries.includes(key))

/* ---------- Intents: a list of words to look for + the reply ---------- */

type Intent = {
  id: string
  words: string[]
  reply: (question: string) => ReactNode
}

/** Does the (normalized) question contain this word or phrase? */
const mentions = (q: string, word: string) => q.includes(' ' + word + ' ') || q.includes(' ' + word + 's ')

const faqIntents: Intent[] = faqs.map((faq) => ({
  id: `faq:${faq.question}`,
  words: faq.keywords,
  reply: () => (
    <>
      <p>
        <strong>{faq.question}</strong> {faq.answer}
      </p>
      <p>
        <ChatLink href="/services#faq">More FAQs →</ChatLink>
      </p>
    </>
  ),
}))

const offerIntents: Intent[] = offers.map((offer) => ({
  id: `offer:${offer.slug}`,
  words: offer.keywords,
  reply: () => <OfferReply offer={offer} />,
}))

const intents: Intent[] = [
  {
    id: 'greeting',
    words: ['hi', 'hello', 'hey', 'yo', 'good morning', 'good evening', 'sup'],
    reply: () => (
      <p>
        Hey! 👋 I can tell you about {site.firstName}&apos;s AI services, demos, projects, pricing or
        availability. What does your business need?
      </p>
    ),
  },
  // FAQ before the offers, so "Do I need a new website?" gets the FAQ answer
  ...faqIntents,
  {
    id: 'pricing',
    words: ['price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'charge', 'fee', 'hourly', 'how much'],
    reply: (q) => {
      const offer = offers.find((o) => o.keywords.some((k) => mentions(q, k)))
      if (offer) return <OfferReply offer={offer} />
      return (
        <>
          <ul>
            {offers.map((o) => (
              <li key={o.slug}>
                <strong>{o.name}</strong>: {o.startingAt ? `from ${o.startingAt}` : priceFallback.toLowerCase()}
              </li>
            ))}
          </ul>
          <p>
            {site.firstName} confirms the final price after a free call, in a fixed-price proposal.{' '}
            <ChatLink href="/services">See services →</ChatLink>
          </p>
        </>
      )
    },
  },
  ...offerIntents,
  {
    id: 'services',
    words: ['service', 'services', 'offer', 'offers', 'what do you do', 'what can you do', 'package', 'packages', 'audit'],
    reply: () => (
      <>
        <p>{site.firstName} offers:</p>
        <ul>
          {offers.map((o) => (
            <li key={o.slug}>
              <ChatLink href="/services">{o.name}</ChatLink> ({o.timeline})
            </li>
          ))}
        </ul>
        <p>Or start with a free AI site audit. Tell me about your business and I&apos;ll point you to the right one.</p>
      </>
    ),
  },
  {
    id: 'lab',
    words: ['demo', 'demos', 'lab', 'ai lab', 'prototype', 'proof', 'show me ai', 'ai work', 'ai projects', 'rag demo', 'mcp'],
    reply: () => (
      <>
        <p>AI demos in the lab:</p>
        <ul>
          {labDemos.map((demo) => (
            <li key={demo.slug}>
              {demo.title} ({demo.status.toLowerCase()})
            </li>
          ))}
        </ul>
        <p>
          <ChatLink href="/lab">Open the AI Lab →</ChatLink> Want one on your site? I can pass your URL to{' '}
          {site.firstName}.
        </p>
      </>
    ),
  },
  {
    id: 'about',
    words: ['who is', 'who are you', 'about you', 'about jason', 'about him', 'yourself', 'background', 'introduce', 'bio'],
    reply: () => (
      <p>
        {site.name} is an AI integration developer in the Philippines. He builds AI assistants and lead automations
        into WordPress and Shopify sites, connected to HubSpot and GoHighLevel, for tour operators and online
        stores. Before that: 5+ years and {projects.length} client sites for agencies and brands in Australia, Canada
        and Ireland. <ChatLink href="/about">More about Jason →</ChatLink>
      </p>
    ),
  },
  {
    id: 'ai',
    words: ['ai', 'ai tool', 'artificial intelligence', 'claude', 'claude code', 'codex', 'chatgpt', 'gpt', 'gemini', 'cursor', 'copilot', 'llm', 'agent', 'vibe coding'],
    reply: () => (
      <>
        <p>
          {site.firstName} ships with {skillGroups[0].shipping.join(', ')} every day, and is building toward{' '}
          {skillGroups[0].building.join(', ')}.
        </p>
        <p>
          <ChatLink href="/skills">Skills</ChatLink> · <ChatLink href="/lab">AI demos</ChatLink>
        </p>
      </>
    ),
  },
  {
    id: 'learning',
    words: ['learning', 'learn', 'studying', 'study', 'roadmap', 'upskill', 'future', 'building toward', 'vector', 'embedding', 'supabase', 'openai api', 'claude api', 'ai sdk'],
    reply: () => (
      <>
        <p>What {site.firstName} is building toward now:</p>
        <ul>
          {skillGroups.map((group) => (
            <li key={group.title}>
              {group.title}: {group.building.join(', ')}
            </li>
          ))}
        </ul>
        <p>
          <ChatLink href="/skills">See skills →</ChatLink>
        </p>
      </>
    ),
  },
  {
    id: 'skills',
    words: ['stack', 'skill', 'tech', 'technologies', 'tools', 'languages', 'framework', 'next.js', 'nextjs', 'react', 'typescript'],
    reply: () => (
      <>
        <ul>
          {skillGroups.map((group) => (
            <li key={group.title}>
              {group.title}: {group.shipping.slice(0, 4).join(', ')}
            </li>
          ))}
        </ul>
        <p>
          <ChatLink href="/skills">Full list →</ChatLink>
        </p>
      </>
    ),
  },
  {
    id: 'shopify',
    words: ['shopify', 'liquid', 'hydrogen', 'store', 'storefront', 'ecommerce', 'e-commerce', 'shop', 'online store'],
    reply: () => (
      <>
        <p>Shopify stores {site.firstName} has built:</p>
        <ProjectList list={byPlatform('shopify')} />
        <p>Want an AI product advisor on your store? Ask me about the AI Website Assistant.</p>
      </>
    ),
  },
  {
    id: 'wordpress',
    words: ['wordpress', 'wp', 'elementor', 'woocommerce', 'acf', 'cms'],
    reply: () => (
      <>
        <p>WordPress is most of {site.firstName}&apos;s client work. Some live examples:</p>
        <ProjectList list={byPlatform('wordpress').slice(0, 5)} />
        <p>Need AI on a WordPress site? Ask me about the AI Website Assistant.</p>
      </>
    ),
  },
  {
    id: 'backend',
    words: ['laravel', 'php', 'backend', 'back-end', 'api', 'database', 'sql', 'custom app', 'web app'],
    reply: () => (
      <>
        <p>
          On the back end {site.firstName} works with PHP, Laravel, SQL and REST APIs: integrations, booking flows
          and CRM hookups. Laravel work:
        </p>
        <ProjectList list={byPlatform('laravel')} />
      </>
    ),
  },
  {
    id: 'travel',
    words: ['travel', 'tour', 'tours', 'tourism', 'tour operator', 'booking', 'itinerary', 'golf'],
    reply: () => (
      <>
        <p>Travel is {site.firstName}&apos;s biggest niche:</p>
        <ProjectList list={byIndustry('travel')} />
        <p>
          For tour operators he builds AI assistants that answer itinerary questions and pass leads to sales.{' '}
          <ChatLink href="/services">See services →</ChatLink>
        </p>
      </>
    ),
  },
  {
    id: 'healthcare',
    words: ['healthcare', 'health', 'medical', 'clinic', 'dialysis', 'hospital', 'doctor', 'patient'],
    reply: () => (
      <>
        <p>Healthcare work:</p>
        <ProjectList list={byIndustry('healthcare')} />
        <p>Clinics are a good fit for the AI Website Assistant: it answers patient questions from your own pages.</p>
      </>
    ),
  },
  {
    id: 'wellness',
    words: ['wellness', 'fitness', 'beauty', 'skincare', 'pilates'],
    reply: () => (
      <>
        <p>Wellness and fitness brands {site.firstName} has built for:</p>
        <ProjectList list={[...byIndustry('wellness'), ...byIndustry('fitness')]} />
      </>
    ),
  },
  {
    id: 'property',
    words: ['real estate', 'property', 'rental', 'realty'],
    reply: () => (
      <>
        <p>Property and real-estate work:</p>
        <ProjectList list={byIndustry('property')} />
      </>
    ),
  },
  {
    id: 'education',
    words: ['education', 'tutoring', 'tutor', 'school', 'course'],
    reply: () => (
      <p>
        In education, {site.firstName} built <ChatLink href="/projects/think-tank-tutors">Think Tank Tutors</ChatLink>:
        tutor booking, SAT prep funnels and parent dashboards on WordPress.
      </p>
    ),
  },
  {
    id: 'projects',
    words: ['project', 'work', 'portfolio', 'clients', 'examples', 'site', 'website', 'built', 'case', 'case study'],
    reply: () => (
      <>
        <p>Case studies:</p>
        <ProjectList list={projects.filter((p) => getCaseStudy(p.slug))} />
        <p>
          <ChatLink href="/projects">All {projects.length} projects →</ChatLink>
        </p>
      </>
    ),
  },
  {
    id: 'experience',
    words: ['experience', 'years', 'agency', 'agencies', 'job', 'career', 'worked', 'employment', 'history', 'resume', 'cv'],
    reply: () => (
      <>
        <ul>
          {experience.map((job) => (
            <li key={job.company}>
              <strong>{job.company}</strong>: {job.role} ({job.shortDates})
            </li>
          ))}
        </ul>
        <p>
          <ChatLink href="/experience">Full timeline →</ChatLink>
        </p>
      </>
    ),
  },
  {
    id: 'availability',
    words: ['available', 'availability', 'hire', 'hiring', 'freelance', 'free', 'open', 'start', 'book', 'capacity'],
    reply: () => (
      <>
        <p>
          Yes, {site.firstName} is booking AI projects{site.bookingMonth ? ` for ${site.bookingMonth}` : ''}. Tell me
          what your business needs and I&apos;ll suggest the right service.
        </p>
        <DemoAsk />
      </>
    ),
  },
  {
    id: 'process',
    words: ['process', 'how do you work', 'workflow', 'steps', 'approach', 'timeline', 'how long', 'deliver'],
    reply: () => (
      <>
        <ol>
          {howItWorks.map((step, i) => (
            <li key={step.title}>
              {i + 1}. {step.title}
            </li>
          ))}
        </ol>
        <p>Assistants take 2–3 weeks, automations 1–2 weeks, website builds 4–8 weeks.</p>
      </>
    ),
  },
  {
    id: 'seo',
    words: ['seo', 'google', 'ranking', 'search', 'performance', 'speed', 'analytics', 'conversion', 'cro'],
    reply: () => (
      <p>
        {site.firstName} spent time as an SEO associate, so every build ships with on-page SEO, analytics and a
        performance pass, plus structured content AI tools can read.
      </p>
    ),
  },
  {
    id: 'location',
    words: ['where', 'location', 'based', 'timezone', 'time zone', 'country', 'philippines', 'remote'],
    reply: () => (
      <p>
        {site.firstName} works remotely from the Philippines (UTC+8), overlapping with Australian and European
        business hours.
      </p>
    ),
  },
  {
    id: 'contact',
    words: ['contact', 'email', 'whatsapp', 'phone', 'call', 'reach', 'message', 'talk'],
    reply: () => (
      <p>
        📧 <a href={`mailto:${site.email}`}>{site.email}</a>
        <br />
        💬{' '}
        <a href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
          WhatsApp {site.whatsappNumber}
        </a>
      </p>
    ),
  },
  {
    id: 'bot',
    words: ['are you ai', 'are you an ai', 'are you a bot', 'are you real', 'are you human'],
    reply: () => (
      <p>
        I&apos;m a lightweight scripted assistant: I match your question to answers written from this portfolio.
        Nothing you type leaves your browser. For anything I can&apos;t answer, {site.firstName}&apos;s a message
        away.
      </p>
    ),
  },
  {
    id: 'thanks',
    words: ['thanks', 'thank you', 'cool', 'great', 'awesome', 'nice', 'perfect'],
    reply: () => <p>Anytime! Anything else you&apos;d like to know?</p>,
  },
]

/* ---------- Public API ---------- */

export const greeting = (
  <p>
    Hi! I&apos;m {site.firstName}&apos;s portfolio assistant. Ask me about his AI services, demos, projects or
    pricing.
  </p>
)

export const suggestions = {
  start: [
    'Can you add a chatbot to my WordPress site?',
    'How much does an automation cost?',
    'Show me travel work.',
    'Will the AI make things up?',
  ],
  after: ['What services do you offer?', 'Show me AI demos', 'What about customer data?', 'Contact'],
}

/** "What's your STACK?!" -> " what's your stack " (lowercase, spaces around every word) */
function normalize(text: string) {
  return ' ' + text.toLowerCase().replace(/[^\w\s.\-']/g, ' ').replace(/\s+/g, ' ') + ' '
}

export function getAnswer(question: string): ReactNode {
  const q = normalize(question)

  // 1. A specific project mentioned by name wins
  const project = projects.find(
    (p) => q.includes(' ' + p.title.toLowerCase() + ' ') || p.keywords.some((k) => q.includes(' ' + k + ' ')),
  )
  if (project) {
    const study = getCaseStudy(project.slug)
    return (
      <>
        <p>
          <strong>{project.title}</strong> — {project.summary}
        </p>
        {project.offlineNote && <p>{project.offlineNote}</p>}
        {study && <p>{study.aiUpgrade}</p>}
        <p>
          <ChatLink href={`/projects/${project.slug}`}>{study ? 'Case study' : 'Project details'}</ChatLink>
          {!project.offlineNote && (
            <>
              {' · '}
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                Live site ↗
              </a>
            </>
          )}
        </p>
      </>
    )
  }

  // 2. Score each intent. Multi-word phrases ("how much") count double.
  let best: Intent | null = null
  let bestScore = 0
  for (const intent of intents) {
    let score = 0
    for (const word of intent.words) {
      if (mentions(q, word)) score += word.includes(' ') ? 2 : 1
    }
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }

  if (best) return best.reply(q)

  // 3. Nothing matched: say so and offer a human
  return (
    <>
      <p>
        I don&apos;t know that one. I only know what&apos;s on this site: services, AI demos, projects, process
        and pricing. Want to ask {site.firstName} directly?
      </p>
      <ContactLine />
    </>
  )
}
