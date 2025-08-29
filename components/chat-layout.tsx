// components/chat-layout.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Trash2, BookOpen, Plus } from 'lucide-react'
import { nanoid } from '@/lib/utils'

export interface Conversation {
  id: string
  name: string
  created_at?: string
}

export interface ChatLayoutProps {
  chatId: string
  missingKeys: string[]
  children: React.ReactNode
}

export function ChatLayout({ chatId, missingKeys, children }: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch saved conversations from backend
    async function load() {
      try {
        const res = await fetch('/api/conversations')
        if (!res.ok) {
          // Nothing saved yet or endpoint not implemented
          setConversations([])
          return
        }
        const data = await res.json()
        setConversations(data)
      } catch (err) {
        console.error('Failed to fetch conversations:', err)
      }
    }
    load()
  }, [])

  const createConversation = async () => {
    const newConv: Conversation = {
      id: nanoid(),
      name: `Conversation ${conversations.length + 1}`,
      created_at: new Date().toISOString()
    }
    // Try to persist to backend; if backend missing, just update local UI
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConv)
      })
      if (res.ok) {
        const saved = await res.json()
        setConversations(prev => [saved, ...prev])
        loadConversation(saved.id)
      } else {
        // Backend missing — fallback to local
        setConversations(prev => [newConv, ...prev])
        loadConversation(newConv.id)
      }
    } catch (e) {
      // fallback local-only
      setConversations(prev => [newConv, ...prev])
      loadConversation(newConv.id)
    }
  }

  const deleteConversation = async (id: string) => {
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    } catch (e) {
      // ignore backend errors — still remove from UI
      console.warn('delete conv backend failed', e)
    }
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const loadConversation = async (id: string) => {
    setActiveId(id)
    setIsOpen(false)

    // Try to fetch messages for that conversation and notify chat component.
    // Implementation detail: your Chat component can fetch messages by conversation id,
    // or you can dispatch an event with the messages here.
    try {
      const res = await fetch(`/api/conversations/${id}`)
      if (res.ok) {
        const payload = await res.json()
        // If your chat component listens for a custom event, dispatch it:
        window.dispatchEvent(
          new CustomEvent('conversation:loaded', { detail: { conversation: payload } })
        )
      } else {
        // If your backend doesn't return messages, send only the id
        window.dispatchEvent(new CustomEvent('conversation:loaded', { detail: { id } }))
      }
    } catch (e) {
      console.warn('Could not load conversation from backend, dispatching id only', e)
      window.dispatchEvent(new CustomEvent('conversation:loaded', { detail: { id } }))
    }
  }

  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      {/* Books / Conversations button */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="fixed top-4 right-4 z-50 px-3 py-2 bg-primary text-white rounded-lg hover:opacity-95 flex items-center gap-2 shadow-lg"
        aria-expanded={isOpen}
      >
        <BookOpen size={18} />
        <span className="hidden sm:inline">Books</span>
      </button>

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-1/2 md:w-1/3 lg:w-1/3 bg-white dark:bg-zinc-900 border-l shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <BookOpen />
            <h2 className="text-lg font-semibold">Conversations</h2>
            <span className="ml-2 text-sm text-muted-foreground">
              ({conversations.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={createConversation}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md border hover:bg-zinc-50 dark:hover:bg-zinc-800"
              title="New conversation"
            >
              <Plus size={14} />
              <span className="text-sm">New</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close"
            >
              ✖
            </button>
          </div>
        </div>

        <div className="p-3 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {loading && <div className="p-3 text-sm text-muted-foreground">Loading…</div>}
          {conversations.length === 0 && !loading && (
            <div className="p-4 text-sm text-muted-foreground">No conversations yet — create one.</div>
          )}

          <ul className="space-y-2">
            {conversations.map(conv => (
              <li
                key={conv.id}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                  activeId === conv.id ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
                onClick={() => loadConversation(conv.id)}
                role="button"
              >
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{conv.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {conv.created_at ? new Date(conv.created_at).toLocaleString() : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conv.id)
                    }}
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main chat content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
