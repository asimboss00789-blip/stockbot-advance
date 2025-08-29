'use client'

import { useState } from 'react'
import type { Message } from '@/lib/types'
import { sendMessage } from '@/lib/chat/serverAction'
import { nanoid } from '@/lib/utils'
import { UserMessage } from './stocks/message'

interface ChatProps {
  id?: string
  missingKeys?: string[]
}

export function Chat({ id, missingKeys }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: nanoid(), role: 'user', text: input }
    ])

    const response = await sendMessage(input)

    // Add AI / assistant message
    setMessages((prev) => [
      ...prev,
      { id: response.id, role: response.role, text: response.text }
    ])

    setInput('')
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <UserMessage key={msg.id} role={msg.role}>
            {msg.text}
          </UserMessage>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  )
}
