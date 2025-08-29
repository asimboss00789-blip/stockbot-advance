'use client'

import { useState } from 'react'
import { nanoid } from '@/lib/utils'
import { Message } from '@/lib/types'
import { sendMessage } from '@/lib/chat/serverAction'

interface ChatProps {
  id: string
  missingKeys: string[]
  initialMessages?: Message[]   // ✅ allow initial messages
}

export function Chat({ id, missingKeys, initialMessages = [] }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!input.trim()) return

    const newMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')
    setLoading(true)

    try {
      const reply = await sendMessage(id, newMessage.content)
      setMessages((prev) => [...prev, reply])
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-black self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">Thinking...</div>}
      </div>

      {/* Input box */}
      <div className="flex items-center border-t p-2">
        <input
          type="text"
          className="flex-1 border rounded-md p-2 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  )
}
