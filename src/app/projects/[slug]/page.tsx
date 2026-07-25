import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { createPublicClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Project, CaseStudySection } from '@/types/database'
import { DEFAULT_PROJECTS } from '@/lib/data'
import { ArrowLeft, ExternalLink, Tag } from 'lucide-react'
import { GithubIcon } from '@/components/Icons'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  let project: Project | null = null

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient()
      if (supabase) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', decodedSlug)
          .single()

        if (data) {
          project = data
        }
      }
    } catch (err) {
      console.warn('Supabase fetch error or fallback:', err)
    }
  }

  // Fallback to DEFAULT_PROJECTS matching the slug
  if (!project) {
    project = DEFAULT_PROJECTS.find((p) => p.slug === decodedSlug || p.slug === slug) || null
  }

  if (!project) {
    return notFound()
  }

  const rawTags = project.tags
  const tags = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === 'string'
    ? (rawTags as string).split(',').map((t) => t.trim()).filter(Boolean)
    : []

  // Check if project content has JSON serialized sections
  let parsedSections: CaseStudySection[] | undefined = project.sections
  if (!parsedSections && project.content && project.content.startsWith('[{"id"')) {
    try {
      parsedSections = JSON.parse(project.content)
    } catch {
      parsedSections = undefined
    }
  }

  return (
    <main className="min-h-screen relative">
      <Navbar />

      <article className="pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-10">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-blue-500 transition-colors glass-panel px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Works</span>
        </Link>

        {/* Header Metadata */}
        <div className="space-y-4">
          {/* Work Category Badge */}
          <div className="inline-block">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 uppercase tracking-widest">
              {project.category || 'Web Development'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            {project.title}
          </h1>

          {/* Short Description */}
          <p className="text-lg sm:text-xl text-[var(--text-muted)] leading-relaxed font-semibold">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Tag className="w-4 h-4 text-[var(--text-muted)]" />
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-bold glass-panel text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 4:3 Aspect Ratio Image Thumbnail */}
        <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden glass-panel border border-[var(--border-color)] shadow-2xl bg-zinc-900">
          <img
            src={project.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
            alt={project.title}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Clean Unwrapped Case Study Content (Tanpa Kotak Pembungkus & Tanpa Garis Bawah Header) */}
        <div className="space-y-8 leading-relaxed pt-4">
          <div className="prose prose-invert max-w-none text-[var(--text-muted)]">
            <MarkdownRenderer content={project.content} sections={parsedSections} />
          </div>

          {/* Optional External Links if provided */}
          {(project.demo_url || project.github_url) && (
            <div className="pt-8 border-t border-[var(--border-color)] flex flex-wrap gap-4">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/30"
                >
                  <span>Visit Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full glass-panel hover:bg-[var(--card-hover)] font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>
          )}
        </div>
      </article>

      <Footer />
    </main>
  )
}
