"use client"

import { useState } from "react"

export default function LoginForm() {
  const [expanded, setExpanded] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [pass, setPass] = useState("")
  const [user, setUser] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !pass) return

    // Simulate login/signup success
    setUser(name)
    setExpanded(false)
    setName("")
    setPass("")
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="font-semibold">Hi, {user}</span>
        <button
          onClick={() => setUser(null)}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Login
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-3 py-1 rounded ${
              mode === "login" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`px-3 py-1 rounded ${
              mode === "signup" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Signup
          </button>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="password"
            placeholder="Pass"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <button
            type="submit"
            className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Done
          </button>
        </form>
      )}
    </div>
  )
}
