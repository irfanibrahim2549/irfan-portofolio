'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/database'
import { ArrowLeft, Save, User, Globe, Mail, CheckCircle2 } from 'lucide-react'
import { GithubIcon, LinkedinIcon, DribbbleIcon } from '@/components/Icons'
import Link from 'next/link'

export default function AdminProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)

  // Profile Form States
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [statusText, setStatusText] = useState('Available for freelance & full-time roles')
  const [isAvailable, setIsAvailable] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [dribbbleUrl, setDribbbleUrl] = useState('')
  const [email, setEmail] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').limit(1).single()
    if (data) {
      setProfileId(data.id)
      setName(data.name || '')
      setTitle(data.title || '')
      setBio(data.bio || '')
      setStatusText(data.status_text || 'Available for freelance & full-time roles')
      setIsAvailable(data.is_available ?? true)
      setAvatarUrl(data.avatar_url || '')
      setGithubUrl(data.github_url || '')
      setLinkedinUrl(data.linkedin_url || '')
      setDribbbleUrl(data.dribbble_url || '')
      setEmail(data.email || '')
    }
    setLoading(false)
  }

  const handleAvatarUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `profile_${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let finalAvatarUrl = avatarUrl

      if (avatarFile) {
        try {
          finalAvatarUrl = await handleAvatarUpload(avatarFile)
        } catch (storageErr: any) {
          console.warn('Storage upload fallback:', storageErr?.message)
        }
      }

      const payload = {
        name,
        title,
        bio,
        status_text: statusText,
        is_available: isAvailable,
        avatar_url: finalAvatarUrl || '/profile.jpg',
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        dribbble_url: dribbbleUrl,
        email,
        updated_at: new Date().toISOString(),
      }

      if (profileId) {
        const { error } = await supabase.from('profiles').update(payload).eq('id', profileId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('profiles').insert(payload)
        if (error) throw error
      }

      alert('Profil & Live Status berhasil diperbarui!')
      fetchProfile()
    } catch (err: any) {
      alert(`Gagal menyimpan profil: ${err?.message || 'Error'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="p-2 rounded-full border border-[var(--border-color)] hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Edit Profil & Live Status</h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">Kelola informasi diri, status ketersediaan, & tautan media sosial</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--text-muted)] font-medium">Memuat data profil...</p>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          {/* Status Availability Settings */}
          <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-4">
            <h2 className="text-sm font-bold text-blue-500 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Live Status Badge Settings</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[var(--text-muted)]">Teks Status Availability</label>
                <input
                  type="text"
                  required
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="Available for freelance & full-time roles"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3 pt-4 sm:pt-0">
                <span className="text-xs font-bold text-[var(--text-muted)]">Status Lampu:</span>
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                    isAvailable
                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-blue-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isAvailable ? 'Available (Hijau/Biru)' : 'Busy (Kuning)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Irfan Ibrahim"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--text-muted)]">Title / Role</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Fullstack Engineer & Product Designer"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-muted)]">Bio Singkat</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Deskripsi singkat diri Anda yang akan tampil di Hero section..."
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 font-medium resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
            <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>Tautan Media Sosial & Kontak (Kosongkan jika tidak ingin ditampilkan)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>URL GitHub (Kosongkan jika tidak ada)</span>
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/irfanibrahim2549"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>URL LinkedIn (Kosongkan jika tidak ada)</span>
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <DribbbleIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>URL Dribbble (Kosongkan jika tidak ada)</span>
                </label>
                <input
                  type="url"
                  value={dribbbleUrl}
                  onChange={(e) => setDribbbleUrl(e.target.value)}
                  placeholder="https://dribbble.com/username"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>Email Kontak (Kosongkan jika tidak ada)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="irfan@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-600/30"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan Profil...' : 'Simpan Perubahan Profil'}</span>
          </button>
        </form>
      )}
    </main>
  )
}
