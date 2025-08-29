'use client'

import { useEffect, useState } from 'react'
import { Trash2, BookOpen } from 'lucide-react'

interface ChatLayoutProps {
  children: React.ReactNode
}

interface Conversation {
  id: string
  name: string
  created_at: string
}

interface User {
  username: string
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  // Load conversations per user from backend
  useEffect(() => {
    if (!user) return
    fetch(`/api/conversations?user=${user.username}`)
      .then((res) => res.json())
      .then((data) => setConversations(data))
      .catch((err) => console.error('Failed to fetch conversations:', err))
  }, [user])

  const loginUser = async () => {
    if (!usernameInput || !passwordInput) return
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, password: passwordInput })
    })
    const data = await res.json()
    if (data.success) {
      setUser({ username: usernameInput })
      setLoginOpen(false)
    } else {
      alert('Login failed!')
    }
  }

  const signupUser = async () => {
    if (!usernameInput || !passwordInput) return
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, password: passwordInput })
    })
    const data = await res.json()
    if (data.success) {
      setUser({ username: usernameInput })
      setLoginOpen(false)
    } else {
      alert('Signup failed!')
    }
  }

  const deleteConversation = async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    setConversations(conversations.filter((c) => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const loadConversation = (id: string) => {
    setActiveId(id)
    // fetch conversation messages from backend
    fetch(`/api/conversations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Loaded conversation:', data)
        // Integrate with chat state
      })
      .catch((err) => console.error('Failed to load conversation:', err))
    setIsOpen(false)
  }

  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      {/* Right-side Books / Login Button */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {user ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <BookOpen size={18} /> Books
          </button>
        ) : (
          <button
            onClick={() => setLoginOpen(!loginOpen)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Login / Signup
          </button>
        )}
      </div>

      {/* Login / Signup Form */}
      {loginOpen && !user && (
        <div className="fixed top-20 right-4 w-80 bg-white border shadow-lg p-4 rounded z-50 flex flex-col gap-2">
          <input
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="border p-2 rounded"
          />
          <div className="flex justify-between gap-2 mt-2">
            <button
              onClick={loginUser}
              className="bg-blue-600 text-white p-2 rounded flex-1 hover:bg-blue-500"
            >
              Login
            </button>
            <button
              onClick={signupUser}
              className="bg-green-600 text-white p-2 rounded flex-1 hover:bg-green-500"
            >
              Signup
            </button>
          </div>
        </div>
      )}

      {/* Slide-out Panel */}
      {user && (
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
      )}

      {/* Main Chat Window */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
