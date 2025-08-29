'use client'

import { useState } from 'react'
import ChatList from '@/components/chat-list'
import Chat from '@/components/chat'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Books / Conversations Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-50 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
      >
        📚 Books
      </button>

      {/* Slide-out Conversation List */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ChatList />
      </div>

      {/* Main Chat Window */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
