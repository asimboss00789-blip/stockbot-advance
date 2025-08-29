"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, signup: isSignup })
    })

    if (res.ok) {
      // ✅ redirect to chat after login/signup success
      router.push("/chat")
    } else {
      alert("Login/Signup failed")
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          Login
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80"
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsSignup(false)}
              className={`flex-1 px-4 py-2 rounded ${!isSignup ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsSignup(true)}
              className={`flex-1 px-4 py-2 rounded ${isSignup ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
            >
              Signup
            </button>
          </div>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 border rounded"
            required
          />

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
          >
            Done
          </button>
        </form>
      )}
    </div>
  )
}
