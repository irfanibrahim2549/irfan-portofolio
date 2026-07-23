'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Project } from '@/types/database'
import { DEFAULT_PROJECTS } from '@/lib/data'
import { ArrowUpRight, Layers } from 'lucide-react'

interface ProjectsProps {
  projects?: Project[]
  title?: string
  showAllButton?: boolean
}

export function Projects({ projects, title = "Selected Works", showAllButton = true }: ProjectsProps) {
  const rawProjects = Array.isArray(projects) && projects.length > 0 ? projects : DEFAULT_PROJECTS
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', 'Web Development', 'Design']

  const filteredProjects = activeFilter === 'All'
    ? rawProjects
    : rawProjects.filter((p) => p.category?.toLowerCase() === activeFilter.toLowerCase())

  return (
    <section id="projects" className="py-16 px-4 max-w-4xl mx-auto space-y-8">
      {/* Section Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            <span>{title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            Featured Projects
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'glass-panel text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const rawTags = project.tags
          const tags = Array.isArray(rawTags)
            ? rawTags
            : typeof rawTags === 'string'
            ? (rawTags as string).split(',').map((t) => t.trim()).filter(Boolean)
            : []

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group glass-panel rounded-3xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Cover Image */}
              <div className="relative aspect-video overflow-hidden bg-zinc-900">
                <img
                  src={project.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-blue-400 border border-blue-500/30">
                    {project.category || 'Web Development'}
                  </span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  {/* Title */}
                  <h3 className="text-xl font-bold tracking-tight text-[var(--text-main)] group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-500 dark:text-blue-400" />
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3 font-medium">
                    {project.description}
                  </p>
                </div>

                {/* Tags & Action Link */}
                <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--card-hover)] border border-[var(--border-color)] text-[var(--text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                    View Detail &rarr;
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Show All Link */}
      {showAllButton && (
        <div className="pt-4 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-[var(--border-color)] glass-panel hover:bg-[var(--card-hover)] font-bold text-sm transition-all"
          >
            <span>View All Works ({rawProjects.length})</span>
            <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </Link>
        </div>
      )}
    </section>
  )
}
