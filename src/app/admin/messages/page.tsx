'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types/database'
import { ArrowLeft, MessageSquare, Mail, Calendar, User, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setMessages(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-3xl">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="p-2 rounded-full border border-[var(--border-color)] hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Inbox Pesan Visitor</span>
            </h1>
            <p className="text-xs text-[var(--text-muted)]">Pesan masuk dari form kontak di halaman depan</p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <p className="text-xs text-[var(--text-muted)]">Memuat pesan...</p>
      ) : messages.length === 0 ? (
        <div className="glass-panel p-12 text-center text-xs text-[var(--text-muted)] rounded-3xl space-y-2">
          <Mail className="w-8 h-8 text-emerald-500/40 mx-auto" />
          <p className="text-sm font-semibold text-[var(--text-main)]">Belum Ada Pesan Masuk</p>
          <p>Pesan yang dikirim oleh pengunjung web akan muncul di halaman ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="glass-panel p-6 rounded-3xl space-y-3 hover:border-emerald-500/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm">{msg.sender_name}</span>
                  <span className="text-xs text-[var(--text-muted)]">({msg.sender_email})</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
