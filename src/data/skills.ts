import type { IconName } from '@/components/ui/Icon'

/**
 * Skills, grouped. AI comes first.
 *
 * shipping = tools you use in client work today.
 * building = tools you're still learning. When you've shipped with one, move it to `shipping`.
 */

export type SkillGroup = {
  title: string
  icon: IconName
  shipping: string[]
  building: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'AI integration',
    icon: 'spark',
    shipping: ['Claude Code', 'Cursor', 'ChatGPT', 'Gemini'],
    building: ['Claude API', 'OpenAI API', 'RAG with Supabase pgvector', 'MCP'],
  },
  {
    title: 'Automation & CRM',
    icon: 'bolt',
    shipping: ['HubSpot', 'GoHighLevel'],
    building: ['n8n', 'AI lead scoring'],
  },
  {
    title: 'Web platforms',
    icon: 'layout',
    shipping: ['WordPress', 'Elementor Pro', 'WooCommerce', 'ACF', 'Shopify', 'Liquid'],
    building: ['Block themes', 'Shopify Hydrogen'],
  },
  {
    title: 'Code',
    icon: 'code',
    shipping: ['PHP', 'Laravel', 'JavaScript', 'SQL', 'REST APIs', 'Next.js', 'React', 'TypeScript'],
    building: ['Vercel AI SDK'],
  },
  {
    title: 'Growth',
    icon: 'chart',
    shipping: ['SEO', 'Analytics', 'CRO', 'Figma', 'Graphic design'],
    building: ['Evals for AI answers'],
  },
]
