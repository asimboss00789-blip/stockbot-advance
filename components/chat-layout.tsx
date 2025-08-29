'use client'

import { useState } from 'react'
import { Trash2, BookOpen } from 'lucide-react'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'

interface ChatLayoutProps {
  chatId: string
  missingKeys: string[]
}

export function ChatLayout({ chatId, missingKeys }: ChatLayoutProps) {
  const [input, setInput] = useState('')
  const [isAtBottom, setIsAtBottom] = useState(true)

  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-container')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
      setIsAtBottom(true)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div
        id="chat-container"
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      >
        <ChatList messages={[]} isShared={false} />
      </div>

      <ChatPanel
        id={chatId}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  )
}
