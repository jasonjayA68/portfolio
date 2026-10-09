import type { IconName } from '@/components/ui/Icon'

/**
 * Skills = tools you use today.
 * Roadmap = tools you're still studying.
 *
 * Keep them separate. When you've learned a roadmap item, move it into `skills`.
 */

export type Skill = {
  title: string
  description: string
  icon: IconName
  tags: string[]
  featured?: boolean
}

export const skills: Skill[] = [
  {
    title: 'AI-assisted development',
    description:
      'AI coding agents and assistants I use across projects to plan, build, review and debug faster.',
    icon: 'spark',
    tags: ['Claude Code', 'Codex', 'ChatGPT', 'Gemini', 'Cursor'],
    featured: true,
  },
  {
    title: 'Front-end development',
    description: 'Responsive, accessible interfaces built with modern web standards.',
    icon: 'code',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Bootstrap'],
  },
  {
    title: 'Back-end development',
    description: 'Server-side logic, custom APIs and database-driven applications.',
    icon: 'server',
    tags: ['PHP', 'Laravel', 'SQL', 'REST APIs'],
  },
  {
    title: 'WordPress & Elementor',
    description: 'Custom themes, page builders and conversion-driven landing pages.',
    icon: 'layout',
    tags: ['WordPress', 'Elementor Pro', 'WooCommerce', 'ACF'],
  },
  {
    title: 'Shopify development',
    description: 'Branded storefronts, headless commerce and Liquid theme customization.',
    icon: 'cart',
    tags: ['Shopify', 'Liquid', 'Hydrogen', 'Apps & integrations'],
  },
  {
    title: 'SEO & marketing',
    description: 'On-page SEO, technical fixes, analytics and conversion optimization.',
    icon: 'chart',
    tags: ['SEO', 'Analytics', 'CRO'],
  },
  {
    title: 'CRM & automation',
    description: 'CRM setup, lead pipelines and marketing automation wired into client websites.',
    icon: 'users',
    tags: ['HubSpot', 'GoHighLevel'],
  },
  {
    title: 'Design & workflow',
    description: 'From graphic design roots to modern dev workflows — versioned, organized, shipped.',
    icon: 'tool',
    tags: ['Git', 'Graphic design', 'Figma', 'VS Code'],
  },
]

export const roadmap: Skill[] = [
  {
    title: 'LLM APIs & SDKs',
    description:
      'Adding AI features — chat, search, summaries, content tools — straight into websites and apps.',
    icon: 'brain',
    tags: ['Claude API', 'OpenAI API', 'Gemini API', 'Vercel AI SDK'],
  },
  {
    title: 'AI agents & MCP',
    description:
      'Agents that use tools and take actions, connected to business systems through the Model Context Protocol.',
    icon: 'agent',
    tags: ['MCP', 'Tool calling', 'Claude Agent SDK', 'LangGraph'],
  },
  {
    title: 'RAG & vector search',
    description: "Assistants that answer from a client's own content — docs, products, FAQs — with citations.",
    icon: 'db',
    tags: ['Embeddings', 'pgvector', 'Supabase', 'Pinecone'],
  },
  {
    title: 'AI-ready modern stack',
    description: 'The front-end stack most AI products and AI coding tools are built around.',
    icon: 'layers',
    tags: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
  },
  {
    title: 'AI automation',
    description: 'AI-powered workflows that qualify leads, reply to customers and sync data across tools.',
    icon: 'bolt',
    tags: ['n8n', 'Make', 'Zapier', 'HubSpot Breeze', 'GHL Conversation AI'],
  },
  {
    title: 'AI prototyping & evals',
    description: 'Shipping prototypes in hours, then testing prompts and outputs so AI features stay reliable.',
    icon: 'rocket',
    tags: ['v0', 'Bolt', 'Lovable', 'Prompt engineering', 'Evals'],
  },
]
