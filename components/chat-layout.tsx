'use client'

import * as React from 'react'
import { useState } from 'react'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { Trash2, BookOpen } from 'lucide-react'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`flex flex-col min-h-screen ${theme}`}>
      <div className="flex justify-between p-4 border-b">
        <button onClick={toggleTheme}>
          Toggle {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  )
}
