/** Work history, newest first. Rendered by src/app/experience/page.tsx. */
export type Job = {
  role: string
  company: string
  dates: string
  shortDates: string // used by the assistant
  description: string
}

export const experience: Job[] = [
  {
    role: 'WordPress Developer',
    company: 'DG Venture LTD',
    dates: 'Apr 2023 — Oct 2025',
    shortDates: 'Apr 2023 – Oct 2025',
    description:
      'Lead WordPress developer on client sites including Ebike Generation, Subtle Energies, Go Euro Tours, Sunshine Coast Property Rentals and the Dream Trips Ireland/Scotland brands — custom themes, plugin integrations and ongoing performance work.',
  },
  {
    role: 'WordPress & Shopify Developer',
    company: 'ESTRAT360',
    dates: 'Apr 2021 — Apr 2023',
    shortDates: 'Apr 2021 – Apr 2023',
    description:
      'Built and customized WordPress and Shopify sites for international clients including Think Tank Tutors, Go Euro Golf, Go Irish Tours, Woven Panel, Connect.ca, TopTier Virtuals and Your Reformer.',
  },
  {
    role: 'SEO Associate',
    company: 'Somenowell Marketing LTD',
    dates: 'Aug 2021 — Dec 2021',
    shortDates: 'Aug – Dec 2021',
    description:
      'Handled on-page SEO, technical audits and content optimization for marketing clients — sharpening the SEO instincts I now bring to every site I build.',
  },
  {
    role: 'Graphic Designer',
    company: 'Estensil Prints and Ads',
    dates: 'Apr 2020 — Apr 2021',
    shortDates: 'Apr 2020 – Apr 2021',
    description:
      'Designed brand assets, print collateral and digital marketing materials — the visual foundation that informs my web design work today.',
  },
]
