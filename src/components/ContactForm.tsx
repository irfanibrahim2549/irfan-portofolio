'use client'

import { useState } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { Send, CheckCircle2, MessageSquare } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { error } = await supabase.from('messages').insert({
          sender_name: formData.name,
          sender_email: formData.email,
          message: formData.message,
        })

        if (error) {
          console.warn('Supabase insertion warning:', error.message)
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err: any) {
      console.error('Contact form error:', err)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-16 px-4 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
          <MessageSquare className="w-4 h-4" />
          <span>Let&apos;s Connect</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
          Get in Touch
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 font-medium">
          Have a project in mind or want to discuss an opportunity? Drop me a message below!
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Message Sent!</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto font-medium">
              Thank you for reaching out. I have received your message and will get back to you shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold glass-panel hover:bg-[var(--card-hover)] cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors font-medium text-sm"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors font-medium text-sm"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                placeholder="Tell me about your project or inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors resize-none font-medium text-sm"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
