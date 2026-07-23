'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Project, CaseStudySection } from '@/types/database'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { 
  Plus, Trash2, LogOut, ArrowLeft, Upload, MessageSquare, Layers, User, 
  Bold, Italic, Heading3, List, ListOrdered, Quote, Code, 
  ChevronUp, ChevronDown, Eye, EyeOff, Sparkles, GripVertical, ArrowUpRight, Tag
} from 'lucide-react'
import Link from 'next/link'

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')

  // Form states
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Web Development')
  const [description, setDescription] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Dynamic Case Study Sections Builder
  const [sections, setSections] = useState<CaseStudySection[]>([
    {
      id: 'sec-1',
      title: 'Overview & Problem Statement',
      content: 'Jelaskan tantangan utama, tujuan projek, dan solusi yang dibangun...',
    },
    {
      id: 'sec-2',
      title: 'Key Highlights & Fitur Utama',
      content: '- Fitur 1: Real-time data processing\n- Fitur 2: Responsive glassmorphism UI\n- Fitur 3: Supabase Authentication & Storage',
    },
  ])

  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (data) setProjects(data)
    setLoading(false)
  }

  // Section Manipulation Helpers
  const addSection = () => {
    const newSec: CaseStudySection = {
      id: `sec-${Date.now()}`,
      title: 'Judul Section Baru',
      content: 'Tuliskan detail section di sini...',
    }
    setSections([...sections, newSec])
  }

  const updateSectionTitle = (id: string, newTitle: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, title: newTitle } : s)))
  }

  const updateSectionContent = (id: string, newContent: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, content: newContent } : s)))
  }

  const removeSection = (id: string) => {
    if (sections.length <= 1) {
      alert('Minimal harus ada 1 section.')
      return
    }
    setSections(sections.filter((s) => s.id !== id))
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setSections(updated)
  }

  // Helper formatting Markdown per section
  const insertFormatToSection = (id: string, before: string, after: string = '') => {
    const textarea = textareaRefs.current[id]
    if (!textarea) return

    const currentSec = sections.find((s) => s.id === id)
    if (!currentSec) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = currentSec.content.substring(start, end) || 'teks'
    const replacement = `${before}${selectedText}${after}`
    const newContent = currentSec.content.substring(0, start) + replacement + currentSec.content.substring(end)

    updateSectionContent(id, newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `projects/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.warn('Storage upload error:', uploadError.message)
      throw uploadError
    }

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let finalImageUrl = imageUrl

      if (imageFile) {
        try {
          finalImageUrl = await handleImageUpload(imageFile)
        } catch (storageErr: any) {
          console.warn('Fallback to sample image URL due to storage policy:', storageErr?.message)
          if (!finalImageUrl) {
            finalImageUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'
          }
          alert(`Catatan Storage: Jalankan SQL Storage Policy di Supabase agar upload file diizinkan.\nDetail: ${storageErr?.message || 'RLS Storage Policy'}`)
        }
      }

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const contentJson = JSON.stringify(sections)

      const { error } = await supabase.from('projects').insert({
        title,
        slug,
        category,
        description,
        content: contentJson,
        image_url: finalImageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
        tags,
        demo_url: demoUrl,
        github_url: githubUrl,
        is_featured: true,
      })

      if (error) {
        alert(`Gagal menambah projek: ${error.message}`)
      } else {
        setTitle('')
        setDescription('')
        setTagsInput('')
        setDemoUrl('')
        setGithubUrl('')
        setImageUrl('')
        setImageFile(null)
        fetchProjects()
        alert('Projek berhasil disimpan!')
      }
    } catch (err: any) {
      alert(`Error: ${err?.message || 'Gagal'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus projek ini?')) return

    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) {
      fetchProjects()
    } else {
      alert(`Gagal menghapus: ${error.message}`)
    }
  }

  const parsedTags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : ['React', 'Next.js']

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-[1600px] mx-auto space-y-8 font-sans">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-full border border-[var(--border-color)] hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>Admin Dashboard</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 font-bold">Live Builder</span>
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-medium">Kelola & susun section projek dengan Live Preview instant</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle Live Preview Button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              showPreview
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                : 'glass-panel text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>

          <Link href="/admin/profile" className="px-4 py-2 rounded-full border border-[var(--border-color)] text-xs font-bold flex items-center gap-2 hover:bg-[var(--card-hover)]">
            <User className="w-4 h-4 text-blue-500" />
            <span>Edit Profil</span>
          </Link>

          <Link href="/admin/messages" className="px-4 py-2 rounded-full border border-[var(--border-color)] text-xs font-bold flex items-center gap-2 hover:bg-[var(--card-hover)]">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>Pesan Masuk</span>
          </Link>

          <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-2 hover:bg-rose-500/20 cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (Editor vs Preview) */}
      <div className="flex lg:hidden items-center p-1 rounded-full glass-panel border border-[var(--border-color)]">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'editor' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)]'
          }`}
        >
          Form Editor
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)]'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Main Split-Screen Layout (Form Editor Left vs Live Preview Sidebar Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form Editor & Drag/Reorder Section Builder */}
        <div className={`space-y-6 ${showPreview ? 'lg:col-span-7' : 'lg:col-span-12'} ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 font-bold text-lg border-b border-[var(--border-color)] pb-4">
              <Plus className="w-5 h-5 text-blue-500" />
              <h2>Tambah Projek & Case Study Builder</h2>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-[var(--text-muted)]">Judul Projek</label>
                  <input
                    type="text"
                    required
                    placeholder="SaaS Analytics Dashboard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">Kategori Work</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 text-[var(--text-main)] font-semibold"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Design">Design</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)]">Ringkasan / Short Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Deskripsi singkat mengenai latar belakang dan tujuan projek..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 resize-none font-medium"
                />
              </div>

              {/* Dynamic Re-orderable Case Study Section Builder */}
              <div className="space-y-4 pt-2 border-t border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Case Study Sections (Drag / Susun Urutan)</span>
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-medium">
                      Gunakan panah &uarr; &darr; untuk mengubah susunan section cerita projek Anda.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSection}
                    className="px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-500/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Section</span>
                  </button>
                </div>

                {/* Sections List */}
                <div className="space-y-4">
                  {sections.map((sec, index) => (
                    <div
                      key={sec.id}
                      className="p-4 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-3 transition-all hover:border-blue-500/40"
                    >
                      {/* Section Controls Bar */}
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--border-color)] pb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <GripVertical className="w-4 h-4 text-[var(--text-muted)] cursor-grab shrink-0" />
                          <span className="text-xs font-extrabold text-blue-500">#{index + 1}</span>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                            placeholder="Judul Section (misal: Key Highlights)"
                            className="flex-1 px-3 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-bold focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Re-order & Delete Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveSection(index, 'up')}
                            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--card-hover)] text-[var(--text-muted)] disabled:opacity-30 cursor-pointer"
                            title="Geser Ke Atas"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === sections.length - 1}
                            onClick={() => moveSection(index, 'down')}
                            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--card-hover)] text-[var(--text-muted)] disabled:opacity-30 cursor-pointer"
                            title="Geser Ke Bawah"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(sec.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                            title="Hapus Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Section Content & Toolbar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[var(--text-muted)]">Isi Konten Section (Markdown Enabled)</span>

                          {/* Quick Toolbar */}
                          <div className="flex items-center gap-1 bg-[var(--card-bg)] p-1 rounded-xl border border-[var(--border-color)]">
                            <button
                              type="button"
                              onClick={() => insertFormatToSection(sec.id, '**', '**')}
                              className="p-1 rounded hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-blue-500"
                              title="Bold"
                            >
                              <Bold className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatToSection(sec.id, '*', '*')}
                              className="p-1 rounded hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-blue-500"
                              title="Italic"
                            >
                              <Italic className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatToSection(sec.id, '### ')}
                              className="p-1 rounded hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-blue-500"
                              title="Heading 3"
                            >
                              <Heading3 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatToSection(sec.id, '\n- ')}
                              className="p-1 rounded hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-blue-500"
                              title="Bullet List"
                            >
                              <List className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatToSection(sec.id, '\n1. ')}
                              className="p-1 rounded hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-blue-500"
                              title="Numbered List"
                            >
                              <ListOrdered className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatToSection(sec.id, '\n> ')}
                              className="p-1 rounded hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-blue-500"
                              title="Quote"
                            >
                              <Quote className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertFormatToSection(sec.id, '\n```\n', '\n```\n')}
                              className="p-1 rounded hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-blue-500"
                              title="Code Block"
                            >
                              <Code className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          ref={(el) => { textareaRefs.current[sec.id] = el }}
                          rows={4}
                          value={sec.content}
                          onChange={(e) => updateSectionContent(sec.id, e.target.value)}
                          placeholder="Ketik poin-poin atau cerita mengenai section ini..."
                          className="w-full px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500 font-mono resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extras & Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">Tags (Pisahkan koma)</label>
                  <input
                    type="text"
                    placeholder="React, Next.js, Tailwind"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">URL Live Demo (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://myproject.com"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">URL GitHub Repo (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/user/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Upload Image File / URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)]">Gambar Thumbnail (File / URL)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20 cursor-pointer"
                  />
                  <span className="text-xs text-[var(--text-muted)] font-medium">atau</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-600/30"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Menyimpan & Uploading...' : 'Simpan Projek'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Real-Time Live Preview Sidebar */}
        <div className={`space-y-6 ${showPreview ? 'lg:col-span-5' : 'hidden'} ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <div className="sticky top-8 space-y-6">
            <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400">Real-Time Live Preview</h3>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold">Auto Sync</span>
            </div>

            {/* Preview Card */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">1. Tampilan Card Katalog</span>
              <div className="glass-panel rounded-3xl overflow-hidden border border-[var(--border-color)] shadow-xl">
                <div className="relative aspect-video overflow-hidden bg-zinc-900">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-blue-400 border border-blue-500/30">
                      {category}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h4 className="text-lg font-bold text-[var(--text-main)] flex items-center justify-between">
                    <span>{title || 'Judul Projek Anda'}</span>
                    <ArrowUpRight className="w-4 h-4 text-blue-500" />
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 font-medium">
                    {description || 'Deskripsi singkat projek akan muncul di sini...'}
                  </p>
                  <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {parsedTags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--card-hover)] border border-[var(--border-color)] text-[var(--text-muted)] font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-blue-500">View Detail &rarr;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Halaman Detail Case Study */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">2. Tampilan Halaman Detail (4:3 Thumbnail & Sections)</span>
              <div className="glass-panel p-5 rounded-3xl space-y-4 border border-[var(--border-color)] max-h-[600px] overflow-y-auto">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/30 uppercase tracking-widest inline-block">
                  {category}
                </span>

                <h3 className="text-2xl font-black text-[var(--text-main)]">
                  {title || 'Judul Projek Anda'}
                </h3>

                <p className="text-xs text-[var(--text-muted)] font-semibold">
                  {description || 'Deskripsi singkat mengenai latar belakang projek...'}
                </p>

                {/* 4:3 Thumbnail Preview */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-[var(--border-color)]">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000'}
                    alt="Preview 4:3"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Rendered Sections Preview */}
                <div className="pt-4 border-t border-[var(--border-color)] space-y-4">
                  <h4 className="text-sm font-bold text-[var(--text-main)]">Case Study Sections:</h4>
                  <MarkdownRenderer sections={sections} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Projek Saat Ini */}
      <div className="space-y-4 pt-8 border-t border-[var(--border-color)]">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          <span>Daftar Projek Tersimpan ({projects.length})</span>
        </h2>

        {loading ? (
          <p className="text-xs text-[var(--text-muted)]">Memuat daftar projek...</p>
        ) : projects.length === 0 ? (
          <div className="glass-panel p-8 text-center text-xs text-[var(--text-muted)] rounded-2xl">
            Belum ada projek yang tersimpan di Supabase. Silakan susun di atas!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={p.image_url} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-zinc-800" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm truncate">{p.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 font-bold shrink-0">
                        {p.category || 'Web Development'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate font-medium">{p.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteProject(p.id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer shrink-0"
                  title="Hapus Projek"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
