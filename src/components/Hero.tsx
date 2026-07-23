'use client'

import { ArrowUpRight, Mail } from 'lucide-react'
import { Profile } from '@/types/database'
import { GithubIcon, LinkedinIcon } from './Icons'

interface HeroProps {
  profile?: Profile | null
}

export function Hero({ profile }: HeroProps) {
  const name = profile?.name || 'Irfan'
  const title = profile?.title || 'Fullstack Engineer & Product Designer'
  const bio = profile?.bio || 'Building high-performance web applications, intuitive interfaces, and scalable cloud systems with intention and precision.'
  const statusText = profile?.status_text || 'Available for freelance & full-time roles'
  const isAvailable = profile?.is_available ?? true
  const avatarUrl = profile?.avatar_url || '/profile.jpg'

  return (
    <section className="pt-32 pb-16 px-4 max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
      {/* Bio Info Left */}
      <div className="space-y-6 flex-1">
        {/* Live Status Badge */}
        <div className="status-badge px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 tracking-wide uppercase">
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'status-dot animate-ping' : 'bg-amber-500'}`} />
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'status-dot' : 'bg-amber-500'}`} />
          <span>{statusText}</span>
        </div>

        {/* Name & Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Hi, I&apos;m <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">{name}</span>
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[var(--text-muted)]">
            {title}
          </p>
        </div>

        {/* Bio */}
        <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl leading-relaxed font-medium">
          {bio}
        </p>

        {/* Action Buttons & Socials */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            className="px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-105 transition-all duration-200"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="#projects"
            className="px-6 py-3.5 rounded-full glass-panel text-sm font-semibold hover:bg-[var(--card-hover)] transition-all"
          >
            View Works
          </a>

          {/* Social Icons */}
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
            <a
              href={profile?.github_url || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full glass-panel text-[var(--text-muted)] hover:text-blue-500 hover:scale-110 transition-all"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={profile?.linkedin_url || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full glass-panel text-[var(--text-muted)] hover:text-blue-500 hover:scale-110 transition-all"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${profile?.email || "contact@example.com"}`}
              className="p-2.5 rounded-full glass-panel text-[var(--text-muted)] hover:text-blue-500 hover:scale-110 transition-all"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* User Profile Photo Right */}
      <div className="relative shrink-0 mx-auto sm:mx-0">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden glass-panel border-2 border-blue-500/30 p-2 shadow-2xl shadow-blue-500/20 group hover:scale-105 transition-transform duration-300">
          <img
            src={avatarUrl}
            alt={name}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        {/* Glow backdrop ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
      </div>
    </section>
  )
}
