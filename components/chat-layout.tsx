'use client'

import { useState } from 'react'
import { ChatList } from './chat-list'
import { Chat } from './chat-panel' // or './chat' if using Chat component
import { Trash2, BookOpen } from 'lucide-react'

interface ChatLayoutProps {
  chatId: string
  missingKeys?: string[]
}

export function ChatLayout({ chatId, missingKeys }: ChatLayoutProps) {
  const [selectedChatId, setSelectedChatId] = useState(chatId)

  return (
    <div className="flex h-full w-full">
      {/* Chat list / sidebar */}
      <aside className="w-72 border-r p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Chats</h2>
          <Trash2 className="cursor-pointer" />
        </div>
        <ChatList messages={[]} isShared={false} />
      </aside>

      {/* Main chat panel */}
      <main className="flex-1 flex flex-col">
        <header className="p-4 border-b flex items-center justify-between bg-white dark:bg-gray-800">
          <h1 className="font-semibold">Chat</h1>
          <BookOpen className="cursor-pointer" />
        </header>

        <div className="flex-1">
          <Chat id={selectedChatId} missingKeys={missingKeys} />
        </div>
      </main>
    </div>
  )
}
