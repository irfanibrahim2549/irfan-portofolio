import React from 'react'
import { CaseStudySection } from '@/types/database'

interface MarkdownRendererProps {
  content?: string
  sections?: CaseStudySection[]
}

export function MarkdownRenderer({ content, sections }: MarkdownRendererProps) {
  // If sections exist, render each section in order
  if (sections && sections.length > 0) {
    return (
      <div className="space-y-8">
        {sections.map((section, sIdx) => (
          <div key={section.id || sIdx} className="space-y-3">
            {section.title && (
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] pt-2">
                {section.title}
              </h3>
            )}
            <RawMarkdownBlock text={section.content} />
          </div>
        ))}
      </div>
    )
  }

  if (!content) return null

  return <RawMarkdownBlock text={content} />
}

function RawMarkdownBlock({ text }: { text: string }) {
  if (!text) return null

  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  let inCodeBlock = false
  let codeBuffer: string[] = []

  lines.forEach((line, index) => {
    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} className="p-4 rounded-2xl bg-zinc-900 border border-[var(--border-color)] text-blue-400 dark:text-blue-300 font-mono text-xs overflow-x-auto my-4">
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        )
        codeBuffer = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      return
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      return
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-xl font-bold text-[var(--text-main)] mt-6 mb-2">
          {formatInline(line.replace('### ', ''))}
        </h3>
      )
      return
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-2xl font-extrabold text-[var(--text-main)] mt-8 mb-3">
          {formatInline(line.replace('## ', ''))}
        </h2>
      )
      return
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-3xl font-black text-[var(--text-main)] mt-8 mb-4">
          {formatInline(line.replace('# ', ''))}
        </h1>
      )
      return
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-[var(--text-muted)] bg-blue-500/5 rounded-r-2xl">
          {formatInline(line.replace('> ', ''))}
        </blockquote>
      )
      return
    }

    // Bullet List (- or *)
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(
        <li key={index} className="ml-6 list-disc text-[var(--text-muted)] my-1.5 font-medium">
          {formatInline(line.trim().replace(/^[-*]\s+/, ''))}
        </li>
      )
      return
    }

    // Numbered List (1. 2. etc)
    if (/^\d+\.\s+/.test(line.trim())) {
      elements.push(
        <li key={index} className="ml-6 list-decimal text-[var(--text-muted)] my-1.5 font-medium">
          {formatInline(line.trim().replace(/^\d+\.\s+/, ''))}
        </li>
      )
      return
    }

    // Empty lines (spacing)
    if (line.trim() === '') {
      elements.push(<div key={index} className="h-3" />)
      return
    }

    // Standard Paragraph
    elements.push(
      <p key={index} className="text-[var(--text-muted)] leading-relaxed my-2 font-medium">
        {formatInline(line)}
      </p>
    )
  })

  return <div className="space-y-1 font-sans">{elements}</div>
}

// Helper to format bold **text** and italic *text* inline
function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g)

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-[var(--text-main)]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-[var(--text-main)]">
          {part.slice(1, -1)}
        </em>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs border border-blue-500/20">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}
