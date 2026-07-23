'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 border-t border-[var(--border-color)] px-4 mt-20">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <span>© {new Date().getFullYear()} Personal Portfolio. Crafted with Next.js & Supabase.</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#projects" className="hover:text-blue-500 transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-blue-500 transition-colors">
            Contact
          </a>
          <Link href="/admin/login" className="hover:text-blue-500 transition-colors font-bold">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  )
}
