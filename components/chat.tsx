'use client'

import { useState } from 'react'
import type { Message } from '@/lib/types'
import { sendMessage } from '@/lib/chat/serverAction'
import { nanoid } from '@/lib/utils'

interface ChatProps {
  id: string
  missingKeys: string[]
}

export function Chat({ id, missingKeys }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSend = async (content: string) => {
    const newMessage: Message = {
      id: nanoid(),
      role: 'user',
      content
    }

    setMessages((prev) => [...prev, newMessage])

    const response = await sendMessage(content)
    setMessages((prev) => [...prev, response])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Render messages */}
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}

      {/* Example input */}
      <input
        type="text"
        className="border p-2"
        placeholder="Type a message..."
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            await handleSend((e.target as HTMLInputElement).value)
            ;(e.target as HTMLInputElement).value = ''
          }
        }}
      />
    </div>
  )
}
