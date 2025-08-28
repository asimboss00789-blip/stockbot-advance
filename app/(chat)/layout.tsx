'use client'

import { useEffect, useState } from "react"
import { Trash2, BookOpen, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatLayoutProps {
  children: React.ReactNode
}

interface Conversation {
  id: string
  name: string
  created_at: string
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null)

  // Load conversations
  useEffect(() => {
    if (!loggedInUser) return
    fetch(`/conversations?user=${loggedInUser}`)
      .then(res => res.json())
      .then(data => setConversations(data))
      .catch(err => console.error(err))
  }, [loggedInUser])

  // Login / Signup
  const handleLoginSignup = () => {
    if (!username || !password) return
    // Mock login/signup API
    setLoggedInUser(username)
    setShowLogin(false)
    localStorage.setItem("luminaUser", username)
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("luminaUser")
    if (savedUser) setLoggedInUser(savedUser)
  }, [])

  // Delete conversation
  const deleteConversation = async (id: string) => {
    await fetch(`/conversations/${id}`, { method: "DELETE" })
    setConversations(conversations.filter(c => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  // Load a conversation
  const loadConversation = (id: string) => {
    setActiveId(id)
    fetch(`/conversations/${id}`)
      .then(res => res.json())
      .then(data => console.log("Loaded conversation:", data))
      .catch(err => console.error(err))
    setIsOpen(false)
  }

  return (
    <div className={`relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
      {/* Books Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-50 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
      >
        <BookOpen size={18} /> Books
      </button>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-16 right-4 z-50 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} Dark Mode
      </button>

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white border-l shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0" : "translate-x-full"} ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black">
            ✖
          </button>
        </div>

        <ul className="divide-y overflow-y-auto max-h-[calc(100vh-4rem)]">
          {conversations.length === 0 && (
            <li className="p-4 text-gray-500">No conversations yet</li>
          )}
          {conversations.map(c => (
            <li
              key={c.id}
              className={`p-4 flex justify-between items-center cursor-pointer ${activeId === c.id ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}`}
              onClick={() => loadConversation(c.id)}
            >
              <span className="truncate">{c.name}</span>
              <button onClick={e => { e.stopPropagation(); deleteConversation(c.id) }} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Login / Signup Panel */}
      {!loggedInUser && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 p-6 bg-white rounded-lg shadow-lg z-50 w-96 transition-all duration-300">
          <h2 className="text-xl font-semibold mb-4">Login / Signup</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <Button onClick={handleLoginSignup} className="w-full">Done</Button>
        </div>
      )}

      {/* Main Chat Window */}
      <div className="flex-1 p-4">
        {loggedInUser ? children : <p className="text-center mt-24 text-gray-500">Please login to access your conversations.</p>}
      </div>
    </div>
  )
}
