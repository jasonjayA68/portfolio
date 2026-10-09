/**
 * ROUTE: /skills
 * The AI roadmap section has id="roadmap", so /skills#roadmap jumps straight to it.
 */
import type { Metadata } from 'next'
import { skills, roadmap } from '@/data/skills'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SkillCard } from '@/components/ui/SkillCard'
import { DecodeText } from '@/components/ui/DecodeText'
import { NextPageLink } from '@/components/ui/NextPageLink'

export const metadata: Metadata = {
  title: 'Skills & tools',
  description: 'The stack I build with, and the AI development skills I am studying now.',
}

export default function SkillsPage() {
  return (
    <>
      <section className="section page-top">
        <div className="container">
          <SectionHeader
            number="02"
            eyebrow="skills & tools"
            title="The stack I build with — end to end."
            subtitle="A curated toolkit for shipping modern websites, from design to deployment."
            as="h1"
          />

          {/* .map() turns each item of the data array into a card */}
          <div className="skills-grid">
            {skills.map((skill) => (
              <SkillCard key={skill.title} skill={skill} />
            ))}
          </div>

          <div className="roadmap" id="roadmap">
            <header className="roadmap-head reveal">
              <p className="eyebrow">
                <span className="eyebrow-num">02.1</span> <DecodeText text="ai roadmap" />
              </p>
              <h2 className="roadmap-title">
                Leveling up for the AI era — <span className="gradient-text">studying now.</span>
              </h2>
              <p className="section-sub">
                The AI development skills clients are hiring for today. I&apos;m actively learning these and adding
                them to client work as they mature — tracked here in public.
              </p>
            </header>
            <ol className="roadmap-grid">
              {roadmap.map((item) => (
                <SkillCard key={item.title} skill={item} learning />
              ))}
            </ol>
          </div>
        </div>
      </section>

      <NextPageLink href="/projects" label="Selected work" />
    </>
  )
}
