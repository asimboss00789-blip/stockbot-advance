// app/api/conversations/route.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// In-memory conversation storage keyed by username
// Replace with DB in production
const conversations: { [user: string]: Array<{ id: string; name: string; created_at: string }> } = {}

export async function GET() {
  const user = cookies().get("user")?.value
  if (!user) return NextResponse.json([], { status: 401 })

  return NextResponse.json(conversations[user] || [])
}

export async function POST(req: Request) {
  const user = cookies().get("user")?.value
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, name } = await req.json()
  const convo = { id, name, created_at: new Date().toISOString() }

  if (!conversations[user]) conversations[user] = []
  conversations[user].push(convo)

  return NextResponse.json(convo)
}
