'use client'

import { useState, useEffect } from 'react'
import { Trash2, BookOpen } from 'lucide-react'
import { submitUserMessage } from '@/lib/chat/serverActions'

interface ChatMessage {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  name: string
  created_at: string
}

interface ChatProps {
  id: string
  missingKeys?: string[]
}

export function Chat({ id, missingKeys }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [signup, setSignup] = useState(false)

  // Load conversations
  useEffect(() => {
    fetch('/conversations')
      .then((res) => res.json())
      .then((data) => setConversations(data))
      .catch(console.error)
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const response = await submitUserMessage(input)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: response }])
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const loadConversation = (id: string) => {
    setActiveId(id)
    fetch(`/conversations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || [])
      })
      .catch(console.error)
    setIsOpen(false)
  }

  const deleteConversation = async (id: string) => {
    await fetch(`/conversations/${id}`, { method: 'DELETE' })
    setConversations(conversations.filter((c) => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const handleLogin = () => {
    if (!username || !password) return
    setLoggedIn(true)
    setSignup(false)
    // Load conversations from backend for this user
    // fetch('/conversations?user=' + username) ...
  }

  const handleSignup = () => {
    if (!username || !password) return
    setLoggedIn(true)
    setSignup(false)
    // Optionally post to backend to create account
  }

  return (
    <div className="relative flex h-[calc(100vh_-_4rem)] overflow-hidden">
      {/* Books panel button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-50 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
      >
        <BookOpen size={18} /> Books
      </button>

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black">
            ✖
          </button>
        </div>
        <ul className="divide-y overflow-y-auto max-h-[calc(100vh-4rem)]">
          {conversations.length === 0 && <li className="p-4 text-gray-500">No conversations yet</li>}
          {conversations.map((c) => (
            <li
              key={c.id}
              className={`p-4 flex justify-between items-center cursor-pointer ${
                activeId === c.id ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'
              }`}
              onClick={() => loadConversation(c.id)}
            >
              <span className="truncate">{c.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(c.id)
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat & login */}
      <div className="flex-1 flex flex-col justify-end bg-gray-50 dark:bg-gray-900">
        {!loggedIn ? (
          <div className="p-6 max-w-md mx-auto flex flex-col gap-2">
            <h2 className="text-xl font-semibold">{signup ? 'Sign Up' : 'Login'}</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={signup ? handleSignup : handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                {signup ? 'Sign Up' : 'Login'}
              </button>
              <button
                onClick={() => setSignup(!signup)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-200"
              >
                {signup ? 'Switch to Login' : 'Switch to Sign Up'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-end p-4 overflow-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`my-1 p-2 rounded ${
                  m.role === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
                }`}
              >
                {m.content}
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
