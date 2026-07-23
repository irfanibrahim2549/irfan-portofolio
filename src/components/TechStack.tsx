'use client'

import { Layout, Server, Terminal, Wrench } from 'lucide-react'

interface SkillCategory {
  title: string
  icon: React.ReactNode
  skills: string[]
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend Development',
    icon: <Layout className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'HTML5 / CSS3'],
  },
  {
    title: 'Backend & Cloud',
    icon: <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    skills: ['Node.js', 'Express', 'Supabase', 'PostgreSQL', 'REST & GraphQL APIs', 'Docker'],
  },
  {
    title: 'Tools & Workflow',
    icon: <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
    skills: ['Git & GitHub', 'VS Code', 'Vercel', 'Postman', 'Figma', 'CI/CD Pipelines'],
  },
]

export function TechStack() {
  return (
    <section id="skills" className="py-16 px-4 max-w-4xl mx-auto space-y-8">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
          <Terminal className="w-4 h-4" />
          <span>Tech Stack & Expertise</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
          Skills & Technologies
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SKILL_CATEGORIES.map((cat) => (
          <div
            key={cat.title}
            className="glass-panel p-6 rounded-3xl space-y-4 hover:border-blue-500/40 transition-all duration-300"
          >
            <div className="flex items-center gap-2 font-bold text-base border-b border-[var(--border-color)] pb-3">
              {cat.icon}
              <span>{cat.title}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-[var(--card-hover)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
