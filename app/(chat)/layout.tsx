'use client'

import { useEffect, useState } from 'react'
import { Trash2, BookOpen, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [darkMode, setDarkMode] = useState(false)

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
    } else alert('Login failed!')
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
    } else alert('Signup failed!')
  }

  const deleteConversation = async (id: string) => {
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    setConversations(conversations.filter((c) => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const loadConversation = (id: string) => {
    setActiveId(id)
    fetch(`/api/conversations/${id}`)
      .then((res) => res.json())
      .then((data) => console.log('Loaded conversation:', data))
      .catch((err) => console.error('Failed to load conversation:', err))
    setIsOpen(false)
  }

  return (
    <div
      className={`relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden transition-colors duration-500 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'
      }`}
    >
      {/* Right-side Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
            darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'
          }`}
          title="Toggle Dark / Light Mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            <BookOpen size={18} /> Books
          </button>
        ) : (
          <button
            onClick={() => setLoginOpen(!loginOpen)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-transform duration-300 hover:scale-105"
          >
            Login / Signup
          </button>
        )}
      </div>

      {/* Login / Signup Form */}
      {loginOpen && !user && (
        <div
          className={`fixed top-20 right-4 w-80 border p-4 rounded shadow-lg flex flex-col gap-2 transition-all duration-500 transform ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          } scale-100`}
        >
          <input
            placeholder="Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="border p-2 rounded bg-gray-100 text-black dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
          <input
            placeholder="Password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="border p-2 rounded bg-gray-100 text-black dark:bg-gray-700 dark:text-white transition-colors duration-300"
          />
          <div className="flex justify-between gap-2 mt-2">
            <button
              onClick={loginUser}
              className="bg-blue-600 text-white p-2 rounded flex-1 hover:bg-blue-500 transition-transform duration-200 hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={signupUser}
              className="bg-green-600 text-white p-2 rounded flex-1 hover:bg-green-500 transition-transform duration-200 hover:scale-105"
            >
              Signup
            </button>
          </div>
        </div>
      )}

      {/* Slide-out Books Panel with Animation */}
      <AnimatePresence>
        {user && isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed top-0 right-0 h-full w-1/2 border-l shadow-lg z-40 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
          >
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black">
                ✖
              </button>
            </div>

            {/* Animated Conversation List */}
            <ul className="overflow-y-auto max-h-[calc(100vh-4rem)] p-2">
              <AnimatePresence>
                {conversations.length === 0 && (
                  <motion.li
                    className="p-4 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    No conversations yet
                  </motion.li>
                )}
                {conversations.map((c) => (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 flex justify-between items-center cursor-pointer transition-colors duration-300 rounded ${
                      activeId === c.id
                        ? darkMode
                          ? 'bg-gray-700 font-semibold'
                          : 'bg-gray-200 font-semibold'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => loadConversation(c.id)}
                  >
                    <span className="truncate">{c.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteConversation(c.id)
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Window */}
      <div className="flex-1 transition-colors duration-500">{children}</div>
    </div>
  )
}
