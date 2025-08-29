// components/chat-layout.tsx
'use client'

import React, { useState } from 'react'
import { Trash2, BookOpen } from 'lucide-react'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState<
    { id: string; name: string; created_at: string }[]
  >([])

  // placeholder delete (no backend yet)
  const deleteConversation = (id: string) => {
    setConversations((c) => c.filter((x) => x.id !== id))
  }

  // placeholder load
  const loadConversation = (id: string) => {
    // Later: fetch conversation messages and set chat state
    console.log('Load conversation', id)
    setIsOpen(false)
  }

  return (
    <div className="relative flex h-[calc(100vh_-_4rem)] overflow-hidden">
      {/* Top-right books button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-50 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
      >
        <BookOpen size={16} />
        <span className="hidden sm:inline">Conversations</span>
      </button>

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 max-w-md bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-600">
            ✖
          </button>
        </div>

        <div className="p-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {conversations.length === 0 ? (
            <div className="p-4 text-gray-500">No conversations yet</div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className="p-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => loadConversation(c.id)}
              >
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.created_at}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(c.id)
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
