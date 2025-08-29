// components/chat.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'

interface ChatProps {
  id?: string
  missingKeys?: string[]
}

export default function Chat({ id, missingKeys }: ChatProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ id: string; role: string; text: string }[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Example welcome message (safe, simple)
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: `Hello! I'm Lumina. Ask me about stocks, writing, or anything. (This is a safe minimal UI until AI integration is re-enabled.)`
      }
    ])
  }, [])

  useEffect(() => {
    // scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const send = async () => {
    if (!input.trim()) return
    const text = input.trim()
    setInput('')
    // append user message
    setMessages((m) => [...m, { id: String(Date.now()), role: 'user', text }])

    // placeholder assistant response (replace later with actual AI call)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: String(Date.now() + 1), role: 'assistant', text: `Got it: "${text}". (AI disabled in baseline.)` }
      ])
    }, 600)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="text-lg font-semibold">Lumina AI</div>
        <div className="text-sm text-gray-500">Session: {id ?? 'local'}</div>
      </div>

      <div className="flex-1 overflow-auto p-4" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block p-3 rounded-md ${
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') send()
            }}
          />
          <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">
            Send
          </button>
        </div>
        {missingKeys && missingKeys.length > 0 && (
          <div className="mt-2 text-sm text-red-600">Missing API keys: {missingKeys.join(', ')}</div>
        )}
      </div>
    </div>
  )
}
