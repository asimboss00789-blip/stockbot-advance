'use client'

import React, { useState, useEffect } from 'react'

interface LoginFormProps {
  onLoginSuccess: (username: string) => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  // Persist theme and user session
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) setDarkMode(savedTheme === 'true')

    const savedUser = localStorage.getItem('luminaUser')
    if (savedUser) onLoginSuccess(savedUser)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return

    // Save user session
    localStorage.setItem('luminaUser', username)
    onLoginSuccess(username)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
        {isSignup ? 'Sign Up' : 'Login'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Login instead' : 'Sign up'}
          </button>
        </div>
      </form>

      <div className="mt-4 flex justify-center items-center gap-2">
        <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="cursor-pointer"
        />
      </div>
    </div>
  )
}
