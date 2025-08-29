"use client"

import { useState } from "react"
import { ChatList } from "@/components/chat-list"   // ✅ fixed import
import Chat from "@/components/chat"                // ✅ Chat has default export
import { ChatPanel } from "@/components/chat-panel" // ✅ named export

interface ChatLayoutProps {
  chatId: string
  missingKeys?: string[]
}

export default function ChatLayout({ chatId, missingKeys }: ChatLayoutProps) {
  const [messages, setMessages] = useState<any[]>([])

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar with chat list */}
      <aside className="w-1/4 border-r border-gray-200 dark:border-gray-800">
        <ChatList />
      </aside>

      {/* Main chat panel */}
      <main className="flex-1 flex flex-col">
        <Chat id={chatId} messages={messages} />
        <ChatPanel chatId={chatId} setMessages={setMessages} missingKeys={missingKeys} />
      </main>
    </div>
  )
}
