'use client'

import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { getMissingKeys } from '@/app/actions'
import ChatLayout from '@/components/layouts/chat-layout'
import { useState } from 'react'

export default function ChatPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [id] = useState(nanoid())

  const handleLogin = async () => {
    // Example API call for login
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) setLoggedIn(true)
  }

  const handleSignup = async () => {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) setLoggedIn(true)
  }

  return (
    <ChatLayout>
      {!loggedIn ? (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Login or Sign Up</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : (
        <AI
          initialAIState={{
            chatId: id,
            messages: [
              {
                id: nanoid(),
                role: 'system',
                content: `Identity:
• Name: Lumina
• Friendly, adaptive AI assistant.
• Maintains context and can recall past conversations.`
              }
            ]
          }}
        >
          <Chat id={id} missingKeys={getMissingKeys()} />
        </AI>
      )}
    </ChatLayout>
  )
}
