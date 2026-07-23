'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/database'
import { User, ArrowLeft, Save, LogOut, MessageSquare, Layers, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [statusText, setStatusText] = useState('Available for work')
  const [isAvailable, setIsAvailable] = useState(true)
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [email, setEmail] = useState('')
  const [userAuthId, setUserAuthId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }

    setUserAuthId(session.user.id)

    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    if (data) {
      setName(data.name || '')
      setTitle(data.title || '')
      setBio(data.bio || '')
      setStatusText(data.status_text || 'Available for work')
      setIsAvailable(data.is_available ?? true)
      setGithubUrl(data.github_url || '')
      setLinkedinUrl(data.linkedin_url || '')
      setEmail(data.email || session.user.email || '')
    } else {
      setEmail(session.user.email || '')
    }
    setLoading(false)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')

    if (!userAuthId) return

    const { error } = await supabase.from('profiles').upsert({
      id: userAuthId,
      name,
      title,
      bio,
      status_text: statusText,
      is_available: isAvailable,
      github_url: githubUrl,
      linkedin_url: linkedinUrl,
      email,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      alert(`Gagal menyimpan profil: ${error.message}`)
    } else {
      setSuccessMsg('Profil berhasil diperbarui!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-full border border-[var(--border-color)] hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Edit Profil & Info</h1>
            <p className="text-xs text-[var(--text-muted)]">Kelola informasi nama, bio, dan status ketersediaan live</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="px-4 py-2 rounded-full border border-[var(--border-color)] text-xs font-semibold flex items-center gap-2 hover:bg-[var(--card-hover)]">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Kelola Projek</span>
          </Link>
          <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-2 hover:bg-rose-500/20 cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--text-muted)]">Memuat profil...</p>
      ) : (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2 font-bold text-lg border-b border-[var(--border-color)] pb-4">
            <User className="w-5 h-5 text-emerald-400" />
            <h2>Informasi Personal & Live Status</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Irfan Developer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Title / Role</label>
              <input
                type="text"
                required
                placeholder="Fullstack Engineer & Creative Designer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Bio Singkat</label>
            <textarea
              rows={3}
              placeholder="Deskripsi latar belakang dan keahlian Anda..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Live Status Badge Controls */}
          <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] space-y-4">
            <h3 className="text-sm font-bold text-emerald-400">Status Ketersediaan Kerja (Live Badge)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-muted)]">Teks Status Badge</label>
                <input
                  type="text"
                  placeholder="Available for freelance & full-time roles"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span>Tampilkan Indikator Lampu Hijau Menyala (Active)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-muted)]">Email</label>
              <input
                type="email"
                placeholder="contact@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-muted)]">URL GitHub</label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-muted)]">URL LinkedIn</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
          </button>
        </form>
      )}
    </main>
  )
}
