'use client'

import { useEffect, useState } from 'react'
import { Trash2, BookOpen, Moon, Sun } from 'lucide-react'

interface ChatLayoutProps {
  children: React.ReactNode
}

interface Conversation {
  id: string
  name: string
  created_at: string
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  // Load conversations
  useEffect(() => {
    fetch('/api/conversations')
      .then((res) => res.json())
      .then((data) => setConversations(data))
      .catch((err) => console.error('Failed to fetch conversations:', err))
  }, [])

  const deleteConversation = async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    setConversations(conversations.filter((c) => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const loadConversation = (id: string) => {
    setActiveId(id)
    fetch(`/api/conversations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Loaded conversation:', data)
      })
      .catch((err) => console.error('Failed to load conversation:', err))
    setIsOpen(false)
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
        
        {/* Right-side Books Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 right-4 z-50 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          <BookOpen size={18} /> Books
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-20 z-50 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span className="ml-1">{darkMode ? 'Light' : 'Dark'}</span>
        </button>

        {/* Slide-out Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-1/2 bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out z-40 dark:bg-gray-800 dark:border-gray-700 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conversations</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              ✖
            </button>
          </div>

          <ul className="divide-y overflow-y-auto max-h-[calc(100vh-4rem)]">
            {conversations.length === 0 && (
              <li className="p-4 text-gray-500 dark:text-gray-400">No conversations yet</li>
            )}
            {conversations.map((c) => (
              <li
                key={c.id}
                className={`p-4 flex justify-between items-center cursor-pointer ${
                  activeId === c.id ? 'bg-gray-100 font-semibold dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                onClick={() => loadConversation(c.id)}
              >
                <span className="truncate">{c.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(c.id)
                  }}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Chat Window */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
