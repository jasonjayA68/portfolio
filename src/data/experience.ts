/** Work history, newest first. Rendered by src/app/experience/page.tsx. */
import { placeholders } from './placeholders'

export type Job = {
  role: string
  company: string
  dates: string
  shortDates: string // used by the assistant
  description: string
  result?: string // one highlighted outcome, shown when set
  link?: { href: string; label: string }
}

export const experience: Job[] = [
  {
    role: 'AI Integration Developer',
    company: 'Freelance',
    dates: 'Oct 2025 — Present',
    shortDates: 'Oct 2025 – now',
    description:
      'AI assistants, lead automations and AI-ready websites for tour operators and online stores.',
    link: { href: '/lab', label: 'See the AI Lab' },
  },
  {
    role: 'WordPress Developer',
    company: 'DG Venture LTD',
    dates: 'Apr 2023 — Oct 2025',
    shortDates: 'Apr 2023 – Oct 2025',
    description:
      'Lead developer on 6 client sites across travel, wellness and property, including Ebike Generation, Subtle Energies, Go Euro Tours and the Dream Trips Ireland/Scotland brands. Built enquiry and booking flows, managed performance and plugin integrations.',
    result: placeholders.dgVentureResult,
  },
  {
    role: 'WordPress & Shopify Developer',
    company: 'ESTRAT360',
    dates: 'Apr 2021 — Apr 2023',
    shortDates: 'Apr 2021 – Apr 2023',
    description:
      'Built WordPress, Shopify and Laravel sites for international clients including Woven Panel, Connect.ca and Your Reformer, with lead funnels and CRM-integrated booking.',
  },
  {
    role: 'SEO Associate',
    company: 'Somenowell Marketing LTD',
    dates: 'Aug 2021 — Dec 2021',
    shortDates: 'Aug – Dec 2021',
    description: 'On-page SEO, technical audits and content optimization for marketing clients.',
  },
  {
    role: 'Graphic Designer',
    company: 'Estensil Prints and Ads',
    dates: 'Apr 2020 — Apr 2021',
    shortDates: 'Apr 2020 – Apr 2021',
    description: 'Brand assets, print collateral and digital marketing materials.',
  },
]
