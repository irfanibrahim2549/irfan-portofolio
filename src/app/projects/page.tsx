import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { createPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Project } from '@/types/database'
import { DEFAULT_PROJECTS } from '@/lib/data'
import Link from 'next/link'
import { ArrowUpRight, Layers } from 'lucide-react'

export const revalidate = 60

export default async function AllProjectsPage() {
  let projects: Project[] = DEFAULT_PROJECTS

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient()
      if (supabase) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true })

        if (Array.isArray(data) && data.length > 0) {
          projects = data
        }
      }
    } catch (err) {
      projects = DEFAULT_PROJECTS
    }
  }

  const safeProjects = Array.isArray(projects) && projects.length > 0 ? projects : DEFAULT_PROJECTS

  return (
    <main className="min-h-screen relative">
      <Navbar />

      <section className="pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            <span>Portfolio Catalog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            All Works & Case Studies
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl font-medium">
            A comprehensive showcase of digital products, web applications, and brand identities crafted with care.
          </p>
        </div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {safeProjects.map((project) => {
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
                prefetch={true}
                className="group glass-panel rounded-3xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image 4:3 Aspect Ratio for Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-blue-400 border border-blue-500/30">
                      {project.category || 'Web Development'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)] group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-blue-500 dark:text-blue-400" />
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-3 font-medium">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--card-hover)] border border-[var(--border-color)] text-[var(--text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                      Read Story &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
    </main>
  )
}
