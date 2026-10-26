import { placeholders } from '@/data/placeholders'
import { SectionHeader } from '@/components/ui/SectionHeader'

/** Client quotes from placeholders.ts. Renders nothing until at least one real quote is added. */
export function Testimonials({ number }: { number: string }) {
  const quotes = placeholders.testimonials.slice(0, 3)
  if (quotes.length === 0) return null

  return (
    <section className="section">
      <div className="container">
        <SectionHeader number={number} eyebrow="kind words" title="What clients say." />
        <ul className="testimonials-grid">
          {quotes.map((quote) => (
            <li key={quote.name} className="card testimonial reveal">
              <figure>
                <blockquote>{quote.text}</blockquote>
                <figcaption>
                  <strong>{quote.name}</strong>
                  <span>
                    {quote.role}, {quote.company}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
