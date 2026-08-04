'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-12 border-t border-[var(--border-color)] px-4 mt-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[var(--text-muted)]">
        <div>
          <span>© {new Date().getFullYear()} Irfan Portfolio. Crafted with Next.js & Supabase.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-blue-500 transition-colors">
            Home
          </Link>
          <Link href="/projects" className="hover:text-blue-500 transition-colors">
            All Works
          </Link>
          <a href="/#contact" className="hover:text-blue-500 transition-colors">
            Get in Touch
          </a>
        </div>
      </div>
    </footer>
  )
}
