'use client'

import { ArrowUpRight, Mail } from 'lucide-react'
import { Profile } from '@/types/database'
import { GithubIcon, LinkedinIcon, DribbbleIcon } from './Icons'

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

  // Social Links Validation (Only render if explicitly filled in Dashboard)
  const github = profile?.github_url?.trim()
  const linkedin = profile?.linkedin_url?.trim()
  const dribbble = profile?.dribbble_url?.trim()
  const email = profile?.email?.trim()

  const hasAnySocial = Boolean(github || linkedin || dribbble || email)

  return (
    <section className="pt-32 pb-16 px-4 max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 font-sans">
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

        {/* Action Buttons & Dynamic Social Icons */}
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
            className="px-6 py-3.5 rounded-full glass-panel text-sm font-bold hover:bg-[var(--card-hover)] transition-all"
          >
            View Works
          </a>

          {/* Social Icons Container (Only rendered if at least 1 social link is filled) */}
          {hasAnySocial && (
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
              {/* GitHub */}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full glass-panel text-[var(--text-muted)] hover:text-blue-500 hover:scale-110 transition-all"
                  aria-label="GitHub"
                  title="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}

              {/* LinkedIn */}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full glass-panel text-[var(--text-muted)] hover:text-blue-500 hover:scale-110 transition-all"
                  aria-label="LinkedIn"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}

              {/* Dribbble */}
              {dribbble && (
                <a
                  href={dribbble}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full glass-panel text-[var(--text-muted)] hover:text-blue-500 hover:scale-110 transition-all"
                  aria-label="Dribbble"
                  title="Dribbble Profile"
                >
                  <DribbbleIcon className="w-4 h-4" />
                </a>
              )}

              {/* Email */}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-full glass-panel text-[var(--text-muted)] hover:text-blue-500 hover:scale-110 transition-all"
                  aria-label="Email"
                  title={`Email ${email}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
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
