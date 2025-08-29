'use client'

import { useState } from 'react'
import { submitUserMessage } from '@/lib/chat/serverActions'
import { Message } from '@/lib/types'

interface ChatProps {
  id: string
  missingKeys: string[]
}

export function Chat({ id, missingKeys }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSubmit = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    }

    setMessages([...messages, userMessage])
    setInput('')

    // Call server action
    const aiReply = await submitUserMessage(input)

    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiReply
    }

    setMessages((prev) => [...prev, aiMessage])
  }

  return (
    <div className="flex flex-col flex-1 p-4 overflow-auto">
      <div className="flex-1 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded ${
              m.role === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}
