'use client'

import React, { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { Message } from '@/lib/types'
import * as serverActions from '@/lib/chat/serverActions'

interface ChatProps {
  id: string
  missingKeys: string[]
}

export function Chat({ id, missingKeys }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  // Load initial messages from server for this chat
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await serverActions.getConversationMessages(id)
        setMessages(res)
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      }
    }
    fetchMessages()
  }, [id])

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')

    try {
      const aiResponse = await serverActions.submitUserMessage(id, input)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: aiResponse }])
    } catch (err) {
      console.error('Failed to get AI response:', err)
    }
  }

  const handleDelete = async (msgId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== msgId))
    try {
      await serverActions.deleteMessage(id, msgId)
    } catch (err) {
      console.error('Failed to delete message:', err)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-black' : 'bg-gray-200 dark:bg-gray-700 text-black'}`}>
            <div className="flex justify-between items-center">
              <span>{msg.content}</span>
              <button onClick={() => handleDelete(msg.id)} className="ml-2 text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-white dark:bg-gray-800 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  )
}
