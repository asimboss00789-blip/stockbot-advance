import { NextResponse } from 'next/server'

interface User {
  username: string
  password: string
}

// Simple in-memory user storage (replace with DB in production)
const users: User[] = []

export async function POST(req: Request) {
  const url = new URL(req.url)
  const path = url.pathname.split('/').pop() // login or signup

  const body = await req.json()
  const { username, password } = body

  if (!username || !password) {
    return NextResponse.json({ success: false, message: 'Missing credentials' })
  }

  if (path === 'signup') {
    const exists = users.find((u) => u.username === username)
    if (exists) {
      return NextResponse.json({ success: false, message: 'Username exists' })
    }
    users.push({ username, password })
    return NextResponse.json({ success: true, message: 'Account created' })
  }

  if (path === 'login') {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      return NextResponse.json({ success: true, message: 'Login successful' })
    }
    return NextResponse.json({ success: false, message: 'Invalid credentials' })
  }

  return NextResponse.json({ success: false, message: 'Invalid request' })
}
