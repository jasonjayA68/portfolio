/**
 * AI demos for /lab. Only real work goes here: "In progress" entries show no
 * video or try link until they actually exist.
 */
import { placeholders } from './placeholders'

export type LabDemo = {
  slug: string
  title: string
  problem: string
  how?: string[] // optional "how it works" lines
  stack: string[]
  status: 'Live' | 'In progress'
  videoUrl?: string // Loom embed URL
  tryHref?: string
  tryLabel?: string
}

export const labDemos: LabDemo[] = [
  {
    slug: 'portfolio-assistant',
    title: 'Portfolio Assistant',
    problem: 'Visitors want quick answers about services, projects and pricing without digging through every page.',
    how: [
      'Scores each question against a list of topics and phrases; a project named in the question wins outright.',
      'Builds every reply from the same data files as this site (services, demos, case studies, FAQ), so answers never drift from the pages.',
      'Runs entirely in the browser with no AI model or API call, so nothing a visitor types leaves the page.',
    ],
    stack: ['Next.js', 'React', 'TypeScript'],
    status: 'Live',
    videoUrl: placeholders.labVideos['portfolio-assistant'],
    tryHref: '/#try-it',
    tryLabel: 'Try it',
  },
  {
    slug: 'tour-enquiry-autopilot',
    title: 'Tour Enquiry Autopilot',
    problem:
      'Form → AI summarizes trip, dates, group size and budget → HubSpot deal → personalized reply drafted.',
    stack: ['WordPress', 'n8n', 'Claude API', 'HubSpot'],
    status: 'In progress',
  },
  {
    slug: 'tour-assistant-rag',
    title: 'Tour Assistant (RAG)',
    problem:
      "A chat that answers only from a sample tour company's itinerary pages, with source links and human handoff.",
    stack: ['Claude API', 'Supabase pgvector', 'Next.js'],
    status: 'In progress',
  },
  {
    slug: 'store-copilot-mcp',
    title: 'Store Copilot (MCP)',
    problem: 'Manage a demo WooCommerce store by talking to AI.',
    stack: ['WordPress', 'WooCommerce', 'MCP', 'Claude'],
    status: 'In progress',
  },
]
