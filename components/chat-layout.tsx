'use client'

import { useState } from 'react'
import { Trash2, BookOpen } from 'lucide-react'
import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'

export interface ChatLayoutProps {
  chatId: string
  missingKeys: string[]
}

export function ChatLayout({ chatId, missingKeys }: ChatLayoutProps) {
  const [input, setInput] = useState('')
  const [isAtBottom, setIsAtBottom] = useState(true)

  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-container')
    chatContainer?.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto" id="chat-container">
        <ChatList messages={[]} session={undefined} isShared={false} />
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
