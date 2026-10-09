/**
 * The assistant's "brain" — no AI, just keyword matching.
 *
 * getAnswer("what shopify work have you done?")
 *   1. Did the question name a project?   -> describe that project
 *   2. Otherwise score every intent by how many of its words appear
 *   3. Return the reply of the best-scoring intent (or a fallback)
 *
 * Replies are JSX instead of HTML strings, so links can be real Next.js
 * <Link>s and React escapes everything the visitor types.
 */
import type { ReactNode } from 'react'
import { projects, type Project } from '@/data/projects'
import { experience } from '@/data/experience'
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

const byPlatform = (key: string) => projects.filter((p) => p.platforms.includes(key))
const byIndustry = (key: string) => projects.filter((p) => p.industries.includes(key))

/* ---------- Intents: a list of words to look for + the reply ---------- */

type Intent = {
  id: string
  words: string[]
  reply: () => ReactNode
}

const intents: Intent[] = [
  {
    id: 'greeting',
    words: ['hi', 'hello', 'hey', 'yo', 'good morning', 'good evening', 'sup'],
    reply: () => (
      <p>
        Hey! 👋 I can tell you about {site.firstName}&apos;s projects, stack, experience, process or
        availability. What would you like to know?
      </p>
    ),
  },
  {
    id: 'about',
    words: ['who is', 'who are you', 'about you', 'about jason', 'about him', 'yourself', 'background', 'introduce', 'bio'],
    reply: () => (
      <>
        <p>
          {site.name} is a full-stack web developer based in {site.locationShort}, with 5+ years of
          experience. He&apos;s shipped 14 live client sites with agencies and direct clients in Australia,
          Canada, Ireland, the Philippines and beyond.
        </p>
        <p>He started in graphic design, so he cares about how things look as much as how they work.</p>
      </>
    ),
  },
  {
    id: 'ai',
    words: ['ai', 'ai tool', 'artificial intelligence', 'claude', 'claude code', 'codex', 'chatgpt', 'gpt', 'gemini', 'cursor', 'copilot', 'llm', 'agent', 'vibe coding'],
    reply: () => (
      <>
        <p>
          {site.firstName} builds with AI in the loop — it speeds up planning, coding, reviews and debugging,
          while he stays responsible for the quality of what ships.
        </p>
        <ul>
          <li>Claude Code &amp; Codex — coding agents</li>
          <li>Cursor — AI-first editor</li>
          <li>ChatGPT &amp; Gemini — research, copy and problem-solving</li>
        </ul>
        <p>
          Next on his <ChatLink href="/skills#roadmap">AI roadmap</ChatLink>: LLM APIs, AI agents &amp; MCP,
          RAG and the Next.js stack.
        </p>
      </>
    ),
  },
  {
    id: 'crm',
    words: ['crm', 'hubspot', 'gohighlevel', 'go high level', 'ghl', 'automation', 'pipeline', 'leads', 'funnel', 'email marketing'],
    reply: () => (
      <p>
        For CRM and automation {site.firstName} works with <strong>HubSpot</strong> and{' '}
        <strong>GoHighLevel</strong> — lead pipelines, forms and follow-up automation connected to the website.
      </p>
    ),
  },
  {
    id: 'learning',
    words: ['learning', 'learn', 'studying', 'study', 'roadmap', 'upskill', 'future', 'mcp', 'rag', 'langchain', 'langgraph', 'vector', 'embedding', 'next.js', 'nextjs', 'react', 'typescript', 'tailwind', 'n8n', 'zapier', 'supabase', 'openai api', 'claude api', 'ai sdk', 'v0', 'lovable', 'chatbot', 'ai app', 'ai feature'],
    reply: () => (
      <>
        <p>
          {site.firstName} is actively studying the AI development skills clients hire for today — learning
          them in public rather than claiming them:
        </p>
        <ul>
          <li>LLM APIs — Claude, OpenAI, Gemini, Vercel AI SDK</li>
          <li>AI agents &amp; MCP — tool calling, Claude Agent SDK, LangGraph</li>
          <li>RAG &amp; vector search — embeddings, pgvector, Supabase</li>
          <li>AI-ready stack — TypeScript, React, Next.js, Tailwind</li>
          <li>AI automation — n8n, Make, Zapier, HubSpot Breeze, GHL Conversation AI</li>
          <li>Prototyping &amp; evals — v0, Bolt, Lovable</li>
        </ul>
        <p>
          <ChatLink href="/skills#roadmap">See the AI roadmap →</ChatLink>
        </p>
      </>
    ),
  },
  {
    id: 'skills',
    words: ['stack', 'skill', 'tech', 'technologies', 'tools', 'languages', 'framework'],
    reply: () => (
      <>
        <p>The core stack:</p>
        <ul>
          <li>Front-end: HTML5, CSS3, JavaScript, jQuery, Bootstrap</li>
          <li>Back-end: PHP, Laravel, SQL, REST APIs</li>
          <li>CMS: WordPress, Elementor Pro, WooCommerce, ACF</li>
          <li>Commerce: Shopify, Liquid, Hydrogen</li>
          <li>AI tools: Claude Code, Codex, ChatGPT, Gemini, Cursor</li>
          <li>
            Learning now: LLM APIs, AI agents &amp; MCP, RAG, Next.js —{' '}
            <ChatLink href="/skills#roadmap">roadmap</ChatLink>
          </li>
          <li>CRM: HubSpot, GoHighLevel</li>
          <li>Also: SEO, analytics, Figma, Git</li>
        </ul>
      </>
    ),
  },
  {
    id: 'shopify',
    words: ['shopify', 'liquid', 'hydrogen', 'store', 'storefront', 'ecommerce', 'e-commerce', 'shop', 'online store'],
    reply: () => (
      <>
        <p>Shopify is a specialty — custom Liquid themes, headless Hydrogen builds, apps and integrations. Live Shopify work:</p>
        <ProjectList list={byPlatform('shopify')} />
      </>
    ),
  },
  {
    id: 'wordpress',
    words: ['wordpress', 'wp', 'elementor', 'woocommerce', 'acf', 'cms'],
    reply: () => (
      <>
        <p>
          Most of {site.firstName}&apos;s agency work is WordPress + Elementor Pro — custom themes, ACF,
          WooCommerce and conversion-focused landing pages. Some live examples:
        </p>
        <ProjectList list={byPlatform('wordpress').slice(0, 6)} />
      </>
    ),
  },
  {
    id: 'backend',
    words: ['laravel', 'php', 'backend', 'back-end', 'api', 'database', 'sql', 'custom app', 'web app'],
    reply: () => (
      <p>
        On the back end {site.firstName} works with PHP and Laravel, SQL databases and REST APIs — custom
        integrations, booking flows, calculators and CRM hookups that sit behind the CMS sites.
      </p>
    ),
  },
  {
    id: 'travel',
    words: ['travel', 'tour', 'tourism', 'booking', 'itinerary', 'golf'],
    reply: () => (
      <>
        <p>Travel is a big one — destination pages, itinerary builders and lead-capture funnels:</p>
        <ProjectList list={byIndustry('travel')} />
      </>
    ),
  },
  {
    id: 'healthcare',
    words: ['healthcare', 'health', 'medical', 'clinic', 'dialysis', 'hospital', 'doctor', 'patient'],
    reply: () => (
      <>
        <p>Healthcare work — patient-friendly sites with booking and clear contact options:</p>
        <ProjectList list={byIndustry('healthcare')} />
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
    words: ['education', 'tutoring', 'tutor', 'school', 'course', 'learning'],
    reply: () => (
      <p>
        In education, {site.firstName} built <ChatLink href="/projects/think-tank-tutors">Think Tank Tutors</ChatLink>{' '}
        — tutor booking, SAT prep funnels and parent dashboards on WordPress.
      </p>
    ),
  },
  {
    id: 'projects',
    words: ['project', 'work', 'portfolio', 'clients', 'examples', 'site', 'website', 'built', 'case'],
    reply: () => (
      <>
        <p>There are {projects.length} live client sites in this portfolio. A few highlights:</p>
        <ProjectList list={projects.slice(0, 5)} />
        <p>
          <ChatLink href="/projects">See all projects →</ChatLink>
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
              <strong>{job.company}</strong> — {job.role} ({job.shortDates})
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
          Yes — {site.firstName} is currently <strong>open for freelance projects</strong>, from new builds to
          redesigns and ongoing maintenance.
        </p>
        <ContactLine />
      </>
    ),
  },
  {
    id: 'pricing',
    words: ['price', 'pricing', 'cost', 'rate', 'budget', 'quote', 'charge', 'fee', 'hourly', 'how much'],
    reply: () => (
      <>
        <p>
          Pricing depends on scope — a landing page, a full Shopify store and a custom Laravel build are very
          different jobs. Every project starts with a free discovery call and a written scope, so you know the
          cost before anything begins.
        </p>
        <ContactLine />
      </>
    ),
  },
  {
    id: 'process',
    words: ['process', 'how do you work', 'workflow', 'steps', 'approach', 'timeline', 'how long', 'deliver'],
    reply: () => (
      <ul>
        <li><strong>Discovery</strong> — free call, goals, written scope &amp; timeline</li>
        <li><strong>Design</strong> — wireframes, then hi-fi responsive mockups</li>
        <li><strong>Build</strong> — WordPress, Shopify or custom, modular and fast</li>
        <li><strong>Launch</strong> — QA, SEO &amp; analytics, handover video and support</li>
      </ul>
    ),
  },
  {
    id: 'seo',
    words: ['seo', 'google', 'ranking', 'search', 'performance', 'speed', 'analytics', 'conversion', 'cro'],
    reply: () => (
      <p>
        {site.firstName} spent time as an SEO associate, so every build ships with on-page SEO, technical fixes,
        analytics and a performance pass — and conversion in mind from the first wireframe.
      </p>
    ),
  },
  {
    id: 'support',
    words: ['maintenance', 'support', 'update', 'fix', 'bug', 'redesign', 'existing site', 'help'],
    reply: () => (
      <p>
        Yes — beyond new builds, {site.firstName} handles redesigns, fixes, speed improvements and ongoing
        maintenance for WordPress and Shopify sites. Launches include a handover video and post-launch support.
      </p>
    ),
  },
  {
    id: 'location',
    words: ['where', 'location', 'based', 'timezone', 'time zone', 'country', 'philippines', 'remote'],
    reply: () => (
      <p>
        {site.firstName} is based in Naawan, Misamis Oriental, Philippines (UTC+8) and works remotely with
        clients in Australia, Canada, Europe and the US.
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
        I&apos;m a lightweight scripted assistant — I match your question to answers written from this
        portfolio. Nothing you type leaves your browser. For anything I can&apos;t answer, {site.firstName}&apos;s
        a message away.
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
    Hi! I&apos;m {site.firstName}&apos;s portfolio assistant. Ask me about his projects, stack, experience,
    pricing or availability.
  </p>
)

export const suggestions = {
  start: ['What AI tools do you use?', 'What Shopify work have you done?', 'Are you available?', 'What are you learning?'],
  after: ['Show me travel projects', 'How much does a site cost?', 'What are you learning?', 'Contact'],
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
    return (
      <>
        <p>
          <strong>{project.title}</strong> — {project.summary}
        </p>
        <p>
          <ChatLink href={`/projects/${project.slug}`}>Project details</ChatLink> ·{' '}
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            Live site ↗
          </a>
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
      if (q.includes(' ' + word + ' ') || q.includes(' ' + word + 's ')) {
        score += word.includes(' ') ? 2 : 1
      }
    }
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }

  if (best) return best.reply()

  // 3. Nothing matched
  return (
    <>
      <p>
        I&apos;m not sure about that one — I only know what&apos;s on this portfolio. Try asking about projects,
        Shopify or WordPress work, experience, process, pricing or availability.
      </p>
      <ContactLine />
    </>
  )
}
