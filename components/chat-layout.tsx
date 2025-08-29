'use client'

import { useState } from 'react'
import { Trash2, BookOpen } from 'lucide-react'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Example conversation list (replace with your data source)
  const conversations = [
    { id: '1', name: 'General Chat' },
    { id: '2', name: 'Stock Analysis' }
  ]

  const loadConversation = (id: string) => {
    setActiveId(id)
    setIsOpen(false)
  }

  const deleteConversation = (id: string) => {
    console.log('Deleting conversation', id)
  }

  return (
    <div className="relative flex h-[calc(100vh_-_64px)] overflow-hidden">
      {/* Right-side Books Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-50 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
      >
        <BookOpen size={18} /> Books
      </button>

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-black"
          >
            ✖
          </button>
        </div>

        <ul className="divide-y overflow-y-auto max-h-[calc(100vh-4rem)]">
          {conversations.length === 0 && (
            <li className="p-4 text-gray-500">No conversations yet</li>
          )}
          {conversations.map((c) => (
            <li
              key={c.id}
              className={`p-4 flex justify-between items-center cursor-pointer ${
                activeId === c.id ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
              }`}
              onClick={() => loadConversation(c.id)}
            >
              <span className="truncate">{c.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(c.id)
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
