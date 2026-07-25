'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { Menu, X, ShieldCheck } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Work', href: '/projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="glass-panel w-full max-w-4xl rounded-full px-5 py-3 flex items-center justify-between shadow-2xl transition-all duration-300">
        {/* Brand / Logo: Profile Photo + Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-500/40 p-0.5 group-hover:scale-110 transition-transform shrink-0 bg-blue-500/10 shadow-sm shadow-blue-500/20">
            <img
              src="/profile.jpg"
              alt="Irfan"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight">
            Irfan<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--text-muted)]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-blue-500 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Controls & Admin Link */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/admin/login"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border border-[var(--border-color)] hover:border-blue-500/40 hover:bg-[var(--card-hover)] transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full border border-[var(--border-color)] text-[var(--text-main)]"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 glass-panel rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-[var(--border-color)] animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-semibold text-[var(--text-muted)] hover:text-blue-500 py-2 border-b border-[var(--border-color)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border border-[var(--border-color)] bg-[var(--card-hover)] text-blue-500"
          >
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Admin Portal</span>
          </Link>
        </div>
      )}
    </header>
  )
}
